import assert from 'node:assert/strict';
import { test } from 'node:test';
import { activityScore, ageOn, compatibility, DatingProfile, distanceKm, harmonicMean, mutuallyEligible, rankRecommendations, scoreDirection, scoreRecommendations, topK } from '../src/features/match/compatibility';

const now = new Date('2026-11-11T12:00:00Z');
const profile = (id: string, overrides: Partial<DatingProfile> = {}): DatingProfile => ({
  id, gender: 'male', date_of_birth: '2000-01-01', ...overrides,
});
test('age handles exact birthdays, invalid dates, leap dates, minors and self exclusion', () => {
  assert.equal(ageOn('2000-11-12', now), 25);
  assert.equal(ageOn('2000-11-11', now), 26);
  assert.equal(ageOn('2000-02-30', now), null);
  assert.equal(ageOn('2000-02-29', now), 26);
  assert.equal(ageOn(undefined, now), null);
  assert.equal(mutuallyEligible(profile('a'), profile('b', { date_of_birth: '2008-11-12' }), now), false);
  assert.equal(mutuallyEligible(profile('a'), profile('b', { date_of_birth: null }), now), false);
  assert.equal(mutuallyEligible(profile('a'), profile('a'), now), false);
});
test('preferences and account visibility are enforced in both directions', () => {
  const a = profile('a', { UserPreference: { preferred_gender: ['FEMALE'], age_min: 24, age_max: 28 } });
  const b = profile('b', { gender: 'female', UserPreference: { preferred_gender: '["MALE"]', age_min: 25, age_max: 27 } });
  assert.equal(mutuallyEligible(a, b, now), true);
  assert.equal(mutuallyEligible(a, { ...b, UserPreference: { preferred_gender: ['female'] } }, now), false);
  assert.equal(mutuallyEligible(a, { ...b, UserPreference: { age_min: 30 } }, now), false);
  assert.equal(mutuallyEligible(profile('a'), profile('b'), now), true);
  for (const overrides of [{ status: 'BANNED' }, { dating_visible: false }, { role: 'ADMIN' }]) {
    assert.equal(mutuallyEligible(profile('a'), profile('b', overrides), now), false);
  }
});
test('Haversine handles zero coordinates, the smaller radius, missing and expired GPS', () => {
  const a = profile('a', { latitude: 0, longitude: 0, location_updated_at: now, UserPreference: { max_distance: 100 } });
  const b = profile('b', { latitude: 0, longitude: 0.1, location_updated_at: now, UserPreference: { max_distance: 10 } });
  assert.ok(Math.abs(distanceKm(a, b, now)! - 11.1195) < 0.01);
  assert.equal(mutuallyEligible(a, b, now), false);
  assert.equal(distanceKm(a, { ...b, latitude: null }, now), null);
  assert.equal(distanceKm(a, { ...b, latitude: 91 }, now), null);
  assert.equal(distanceKm(a, { ...b, location_updated_at: new Date('2026-01-01') }, now), null);
  assert.equal(mutuallyEligible(a, { ...b, latitude: null }, now), true);
  assert.equal(mutuallyEligible({ ...a, UserPreference: { distance_required: true } }, { ...b, latitude: null }, now), false);
});
test('Jaccard normalizes synonymous legacy interests, removes duplicates and renormalizes missing weights', () => {
  const a = profile('a', { interests: [{ name: 'Đọc sách' }, { name: 'Du lịch' }, { name: 'Âm nhạc' }] });
  const b = profile('b', { interests: [{ name: 'Đi du lịch' }, { name: 'Nghe nhạc' }, { name: 'Thể thao' }] });
  assert.equal(scoreDirection(a, b, now).signals.interests, 0.5);
  assert.equal(scoreDirection(a, b, now).score, 0.5);
  assert.equal(compatibility(a, b, now).score, 50);
  assert.equal(compatibility(a, { ...b, interests: [...b.interests!, ...b.interests!] }, now).score, 50);
  assert.equal(compatibility(a, b, now).score, compatibility(b, a, now).score);
});
test('the document example produces forward 0.65, reverse 0.50 and harmonic 56.521739 points', () => {
  const a = profile('a', {
    interests: [{ name: 'Reading' }, { name: 'Travel' }, { name: 'Music' }],
    relationship_goal: 'LONG_TERM', latitude: 0, longitude: 0, location_updated_at: now, last_active: now,
    UserPreference: { distance_half_life: 10 },
  });
  const b = profile('b', {
    interests: [{ name: 'Travel' }, { name: 'Music' }, { name: 'Sport' }],
    relationship_goal: 'LONG_TERM', latitude: 0, longitude: 10 / 6371 * 180 / Math.PI, location_updated_at: now,
    last_active: new Date(now.getTime() - 7 * 86400000),
    UserPreference: { relationship_goal: 'SHORT_TERM', accepted_goals: ['LONG_TERM'], distance_half_life: 5 },
  });
  assert.ok(Math.abs(scoreDirection(a, b, now).score! - 0.65) < 1e-12);
  assert.ok(Math.abs(scoreDirection(b, a, now).score! - 0.5) < 1e-12);
  assert.ok(Math.abs(compatibility(a, b, now).score! - 56.52173913043479) < 1e-10);
  assert.equal(harmonicMean(0, 0), 0);
  assert.equal(harmonicMean(1, 0), 0);
  assert.equal(activityScore({ id: 'b', last_active: new Date(now.getTime() - 14 * 86400000) }, now), 0.25);
});
test('cold start does not present activity-only data as high compatibility; observed zero stays zero', () => {
  const a = profile('a', { last_active: now }), b = profile('b', { last_active: now });
  assert.equal(compatibility(a, b, now).score, null);
  assert.equal(compatibility(a, b, now).cold_start, true);
  const poorA = profile('a', { interests: [{ name: 'Music' }], relationship_goal: 'LONG_TERM' });
  const poorB = profile('b', { interests: [{ name: 'Sport' }], relationship_goal: 'SHORT_TERM' });
  assert.equal(compatibility(poorA, poorB, now).score, 0);
  assert.equal(compatibility(poorA, poorB, now).cold_start, false);
});
test('required goals reject mismatches and accept declared alternatives', () => {
  const a = profile('a', { relationship_goal: 'LONG_TERM', UserPreference: { goal_required: true } });
  const b = profile('b', { relationship_goal: 'SHORT_TERM' });
  assert.equal(mutuallyEligible(a, b, now), false);
  assert.equal(mutuallyEligible({ ...a, UserPreference: { goal_required: true, accepted_goals: ['SHORT_TERM'] } }, b, now), true);
  assert.equal(mutuallyEligible(a, profile('b'), now), false);
});
test('Top K uses full precision, stable ties and does not inflate scores for Super Likes', () => {
  const a = profile('viewer', { interests: [{ name: 'Music' }], relationship_goal: 'LONG_TERM' });
  const weak = Array.from({ length: 25 }, (_, i) => profile('weak-' + i, { interests: [{ name: 'Sport' }], relationship_goal: 'SHORT_TERM' }));
  const strong = profile('strong', { interests: [{ name: 'Music' }], relationship_goal: 'LONG_TERM' });
  const candidates = [...weak, strong, { ...strong, id: 'strong-2' }];
  const results = rankRecommendations(a, candidates, new Map(), now);
  assert.equal(results[0].profile.id, 'strong');
  assert.deepEqual(topK(scoreRecommendations(a, candidates.reverse(), now), 5), results.slice(0, 5));
  const boosted = rankRecommendations(a, [strong], new Map([['strong', 'superlike']]), now)[0];
  assert.equal(boosted.rank, results[0].rank);
  assert.deepEqual(topK(results, 0), []);
});

export interface Interest {
  id: string;
  name: string;
  icon: string; // Bootstrap icon class name e.g. "bi-music-note-beamed"
  category: InterestCategory;
}

export enum InterestCategory {
  MUSIC = 'music',
  SPORTS = 'sports',
  LIFESTYLE = 'lifestyle',
  FOOD = 'food',
  TRAVEL = 'travel',
  ARTS = 'arts',
  TECHNOLOGY = 'technology',
  OUTDOOR = 'outdoor'
}

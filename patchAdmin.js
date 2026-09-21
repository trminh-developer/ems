const fs = require('fs');
let code = fs.readFileSync('frontend/src/views/AdminVerificationsView.tsx', 'utf8');

const targetImg = `<img src={selectedReq.selfieImage || selectedReq.selfie_image} alt="Selfie" className="img-fluid rounded" style={{ height: '150px', objectFit: 'cover', width: '100%' }} />`;
const replacement = `
                    {(selectedReq.selfieImage || selectedReq.selfie_image)?.startsWith('data:video') ? (
                      <video src={selectedReq.selfieImage || selectedReq.selfie_image} controls autoPlay loop className="img-fluid rounded" style={{ height: '150px', objectFit: 'cover', width: '100%' }}></video>
                    ) : (
                      <img src={selectedReq.selfieImage || selectedReq.selfie_image} alt="Selfie" className="img-fluid rounded" style={{ height: '150px', objectFit: 'cover', width: '100%' }} />
                    )}
`;
code = code.replace(targetImg, replacement);

fs.writeFileSync('frontend/src/views/AdminVerificationsView.tsx', code);
console.log("AdminVerificationsView updated");

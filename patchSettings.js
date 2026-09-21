const fs = require('fs');
let code = fs.readFileSync('frontend/src/views/SettingsView.tsx', 'utf8');

// 1. Add new states
const stateInsertPos = code.indexOf('const [capturedImage, setCapturedImage] = useState<string | null>(null);');
const newStates = `const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [recordedVideo, setRecordedVideo] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [livenessInstruction, setLivenessInstruction] = useState("Vui lòng nhìn thẳng vào camera");
  const mediaRecorderRef = useRef<any>(null);
  const chunksRef = useRef<any[]>([]);`;
code = code.replace('const [capturedImage, setCapturedImage] = useState<string | null>(null);', newStates);

// 2. Add handleIdCardUpload
const uploadFunc = `
  const handleIdCardUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
`;
code = code.replace('const startCamera = async () => {', uploadFunc + '\n  const startCamera = async () => {');

// 3. Add recordVideo logic
const captureLogicPos = code.indexOf('const capturePhoto = () => {');
const recordLogic = `
  const startRecording = () => {
    if (!stream) return;
    setIsRecording(true);
    chunksRef.current = [];
    const mediaRecorder = new (window as any).MediaRecorder(stream, { mimeType: 'video/webm' });
    mediaRecorderRef.current = mediaRecorder;
    
    mediaRecorder.ondataavailable = (e: any) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        setRecordedVideo(reader.result as string);
      };
    };
    
    mediaRecorder.start(200); // 200ms chunks
    
    // Simulate liveness instructions sequence
    const instructions = [
      "Vui lòng nhìn thẳng vào camera",
      "Từ từ xoay mặt sang TRÁI",
      "Từ từ xoay mặt sang PHẢI",
      "Nhìn lên TRÊN",
      "Nhìn xuống DƯỚI",
      "Đưa thiết bị ra XA một chút",
      "Đang xử lý..."
    ];
    
    let step = 0;
    setLivenessInstruction(instructions[0]);
    
    const interval = setInterval(() => {
      step++;
      if (step < instructions.length) {
        setLivenessInstruction(instructions[step]);
      }
      if (step >= instructions.length - 1) {
        clearInterval(interval);
        setTimeout(() => {
          mediaRecorder.stop();
          setIsRecording(false);
          stopCamera();
        }, 1000);
      }
    }, 2000); // 2 seconds per instruction
  };
  
  const retakeVideo = () => {
    setRecordedVideo(null);
    setLivenessInstruction("Vui lòng nhìn thẳng vào camera");
    startCamera();
  };
`;
// Replace capturePhoto and retakePhoto
const retakeEndPos = code.indexOf('useEffect(() => {', captureLogicPos);
code = code.substring(0, captureLogicPos) + recordLogic + code.substring(retakeEndPos);

// 4. Update step 1 UI (ID Card input)
const step1Target = `<input type="file" className="form-control mb-4" accept="image/*" />`;
const step1Replacement = `
                  <input type="file" className="form-control mb-2" accept="image/*" onChange={handleIdCardUpload} />
                  {idCardImage && (
                    <div className="mb-4 text-center">
                      <img src={idCardImage} alt="ID Card Preview" className="img-fluid rounded border border-secondary" style={{ maxHeight: '150px' }} />
                    </div>
                  )}
`;
code = code.replace(step1Target, step1Replacement);

// 5. Fix Step 1 continue button disabled state
code = code.replace('<Button className="btn-primary" disabled={isScanningId} onClick={() => {', '<Button className="btn-primary" disabled={isScanningId || !idCardImage} onClick={() => {');

// 6. Update step 2 UI (Video recording)
const step2Old = `{!capturedImage ? (
                      <>
                        <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}></video>
                        <Button className="btn-primary position-absolute bottom-0 start-50 translate-middle-x mb-3 rounded-pill px-4" onClick={capturePhoto}>
                          <i className="bi bi-camera-fill me-2"></i> Chụp ảnh
                        </Button>
                      </>
                    ) : (
                      <>
                        <img src={capturedImage} alt="Selfie" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <Button className="btn-secondary position-absolute bottom-0 start-50 translate-middle-x mb-3 rounded-pill px-4" onClick={retakePhoto}>
                          <i className="bi bi-arrow-counterclockwise me-2"></i> Chụp lại
                        </Button>
                      </>
                    )}`;
const step2New = `{!recordedVideo ? (
                      <>
                        <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}></video>
                        
                        {isRecording && (
                          <div className="position-absolute top-0 w-100 p-2 bg-dark bg-opacity-75 text-warning fw-bold animate-pulse">
                            <i className="bi bi-record-circle-fill text-danger me-2"></i> {livenessInstruction}
                          </div>
                        )}
                        
                        {!isRecording && (
                          <Button className="btn-primary position-absolute bottom-0 start-50 translate-middle-x mb-3 rounded-pill px-4 shadow" onClick={startRecording}>
                            <i className="bi bi-camera-video-fill me-2"></i> Bắt đầu quay Video
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <video src={recordedVideo} autoPlay loop playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover", transform: "scaleX(-1)" }}></video>
                        <Button className="btn-secondary position-absolute bottom-0 start-50 translate-middle-x mb-3 rounded-pill px-4" onClick={retakeVideo}>
                          <i className="bi bi-arrow-counterclockwise me-2"></i> Quay lại
                        </Button>
                      </>
                    )}`;
code = code.replace(step2Old, step2New);

// 7. Update disabled state on step 2 continue button
code = code.replace('disabled={!capturedImage}', 'disabled={!recordedVideo}');

// 8. Update useEffect dependency
code = code.replace('[isVerificationModalOpen, verificationStep, capturedImage]', '[isVerificationModalOpen, verificationStep, recordedVideo]');
code = code.replace('!capturedImage', '!recordedVideo'); // Inside useEffect

// 9. Update the submission payload in step 3
code = code.replace('id_card_image: "ID_CARD_BASE64_PLACEHOLDER"', 'id_card_image: idCardImage');
code = code.replace('selfie_image: capturedImage', 'selfie_image: recordedVideo');

fs.writeFileSync('frontend/src/views/SettingsView.tsx', code);
console.log("SettingsView updated");

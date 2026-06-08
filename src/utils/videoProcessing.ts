
export async function removeAudioFromVideo(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.src = URL.createObjectURL(file);
    
    video.onloadedmetadata = () => {
      const stream = (video as any).captureStream ? (video as any).captureStream() : (video as any).mozCaptureStream();
      
      // Filter out audio tracks
      const videoStream = new MediaStream(stream.getVideoTracks());
      
      const mediaRecorder = new MediaRecorder(videoStream, {
        mimeType: 'video/webm;codecs=vp8' 
      });
      
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        resolve(blob);
        URL.revokeObjectURL(video.src);
      };
      
      mediaRecorder.start();
      video.play();
      
      // Stop recording when video ends
      video.onended = () => {
        mediaRecorder.stop();
      };
      
      // If video is short, we wait for it to finish. 
      // This is a client-side hack for removing audio without a heavy library like ffmpeg.wasm.
      // For a production app, a server-side process or ffmpeg.wasm would be better.
    };
    
    video.onerror = (e) => reject(e);
  });
}

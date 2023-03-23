const ASSEMBLY_AI_API_KEY = "03b38afe584044119698090c08611c87";

const sendRecording = async (audioFile) => {
  const formData = new FormData();
  formData.append("audio", audioFile, "audio.wav");

  const response = await fetch("https://api.assemblyai.com/v2/upload", {
    method: "POST",
    headers: {
      Authorization: ASSEMBLY_AI_API_KEY,
    },
    body: formData,
  });

  const { upload_url } = await response.json();

  const transcriptResponse = await fetch(
    "https://api.assemblyai.com/v2/transcript",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: ASSEMBLY_AI_API_KEY,
      },
      body: JSON.stringify({
        audio_url: upload_url,
      }),
    }
  );

  const transcript = await transcriptResponse.json();
  return transcript;
};

export default sendRecording;
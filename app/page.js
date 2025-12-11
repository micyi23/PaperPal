const handleUpload = async () => {
  if (!file) return alert("Please upload a PDF");

  const formData = new FormData();
  formData.append("file", file);

  setLoading(true);

  const res = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();

  if (data.error) {
    alert("PDF failed to process");
  } else {
    setText(data.text);
  }

  setLoading(false);
};

const speakText = () => {
  if (!text) return alert("Nothing to read");
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 1;
  speechSynthesis.speak(utterance);
};


const BASE_URL = "http://localhost:5000"; // change to your backend URL if deployed

export async function getCDSASummary(patient) {
  try {
    const response = await fetch(`${BASE_URL}/cdsa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(patient)
    });

    const data = await response.json();
    return data.summary;
  } catch (error) {
    console.error("CDSA API Error:", error);
    return "Failed to fetch AI summary.";
  }
}

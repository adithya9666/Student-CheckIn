export const API = "http://localhost:5000/api";

export async function addEntry(data) {
  const res = await fetch(`${API}/entry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
}

export async function getEntries() {
  const res = await fetch(`${API}/entries`);
  return res.json();
}
export async function deleteEntry(id) {
    const res = await fetch(`${API}/entry/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "x-user-id": "local-user"
      }
    });
  
    return res.json();
  }
  
  
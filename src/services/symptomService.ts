// This service currently returns hardcoded symptoms,
// but mimics an async API call.
// When the backend is ready, replace the implementation with a fetch.

export interface Symptom {
  id: string; // the value used in filtering (e.g., "covid")
  label: string; // display text (e.g., "COVID 🤧")
}

// Hardcoded data matching your current symptoms
const hardcodedSymptoms: Symptom[] = [
  { id: "All", label: "All 🔴" },
  { id: "heavysmoker", label: "Heavy Smoker 🚬" },
  { id: "cold", label: "Cold 🤒" },
  { id: "influenza", label: "Influenza 😷" },
  { id: "covid", label: "COVID 🤧" },
  { id: "sars", label: "SARS 🦠" },
  { id: "rsv", label: "RSV 🏥" },
];

// Simulate network delay
export const fetchSymptoms = async (): Promise<Symptom[]> => {
  // When backend is ready, replace with:
  // const response = await fetch('/api/symptoms');
  // return response.json();

  return new Promise((resolve) => {
    setTimeout(() => resolve(hardcodedSymptoms), 100);
  });
};

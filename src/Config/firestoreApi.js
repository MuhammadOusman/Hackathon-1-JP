import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "./Config";

// Return an array of { id, ...data }
export async function listCollection(collName) {
  const snap = await getDocs(collection(db, collName));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

// Create a document (optionally with a provided id)
export async function createDocument(collName, data, id) {
  if (id) {
    await setDoc(doc(db, collName, id), data);
    return id;
  }
  const ref = await addDoc(collection(db, collName), data);
  return ref.id;
}

export async function updateDocument(collName, id, data) {
  const ref = doc(db, collName, id);
  await updateDoc(ref, data);
}

export async function deleteDocument(collName, id) {
  const ref = doc(db, collName, id);
  await deleteDoc(ref);
}

export async function getDocument(collName, id) {
  const ref = doc(db, collName, id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

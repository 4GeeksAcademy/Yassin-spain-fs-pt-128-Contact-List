import * as api from "./services/apiServices";

//el imoprt de api es un objeto para que sea faacil de usar

export const initialStore = () => ({
  contacts: [],
  loading: false,
  error: null,
});

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "SET_LOADING":
      return { ...store, loading: action.payload };
    case "SET_ERROR":
      return { ...store, error: action.payload };
    case "SET_CONTACTS":
      return { ...store, contacts: action.payload };
    case "DELETE_CONTACT":
      return {
        ...store,
        contacts: store.contacts.filter((c) => String(c.id) !== String(action.payload)),
      };
    default:
      throw Error("Unknown action.");
  }
}

// READ
export async function loadContacts(dispatch) {
  dispatch({ type: "SET_LOADING", payload: true });
  dispatch({ type: "SET_ERROR", payload: null });
  try {
    const contacts = await api.getContacts();
    dispatch({ type: "SET_CONTACTS", payload: contacts });
  } catch (e) {
    dispatch({ type: "SET_ERROR", payload: e.message });
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
}

// CREATE
export async function addContact(dispatch, payload) {
  dispatch({ type: "SET_LOADING", payload: true });
  dispatch({ type: "SET_ERROR", payload: null });
  try {
    await api.createContact(payload);
    const contacts = await api.getContacts();
    dispatch({ type: "SET_CONTACTS", payload: contacts });
  } catch (e) {
    dispatch({ type: "SET_ERROR", payload: e.message });
    throw e;
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
}

// UPDATE
export async function editContact(dispatch, id, payload) {
  dispatch({ type: "SET_LOADING", payload: true });
  dispatch({ type: "SET_ERROR", payload: null });
  try {
    await api.updateContact(id, payload);
    const contacts = await api.getContacts();
    dispatch({ type: "SET_CONTACTS", payload: contacts });
  } catch (e) {
    dispatch({ type: "SET_ERROR", payload: e.message });
    throw e;
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
}

// DELETE
export async function removeContact(dispatch, id) {
  dispatch({ type: "SET_LOADING", payload: true });
  dispatch({ type: "SET_ERROR", payload: null });
  try {
    await api.deleteContact(id);
    dispatch({ type: "DELETE_CONTACT", payload: id });
  } catch (e) {
    dispatch({ type: "SET_ERROR", payload: e.message });
    throw e;
  } finally {
    dispatch({ type: "SET_LOADING", payload: false });
  }
}
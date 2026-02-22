import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import ContactCard from "../components/ContactCard";
import { loadContacts } from "../store";

export const Contacts = () => {
  const { store, dispatch } = useGlobalReducer();

  useEffect(() => {
    loadContacts(dispatch);
  }, [dispatch]);

  return (
    <div className="container py-4">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h1 className="h3 m-0">Contacts</h1>

        <Link to="/add" className="btn btn-success">
          Add new contact
        </Link>
      </div>

      {store.loading && <div className="alert alert-info">Loading...</div>}
      {store.error && <div className="alert alert-danger">{store.error}</div>}

      {!store.loading && store.contacts.length === 0 ? (
        <div className="alert alert-secondary mb-0">
          No contacts yet. Click <strong>Add new contact</strong> to create one.
        </div>
      ) : (
        <div className="list-group">
          {store.contacts.map((c) => (
            <ContactCard key={c.id} contact={c} />
          ))}
        </div>
      )}
    </div>
  );
};
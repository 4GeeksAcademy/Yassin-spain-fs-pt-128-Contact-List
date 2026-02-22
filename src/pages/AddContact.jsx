import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { addContact, editContact, loadContacts } from "../store";

export const AddContact = () => {
  const { store, dispatch } = useGlobalReducer();
  const { id } = useParams(); // si hay id editamos
  const navigate = useNavigate();
  const isEdit = !!id;

  const existing = useMemo(() => {
    return store.contacts.find((c) => String(c.id) === String(id));
  }, [store.contacts, id]);

  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [localError, setLocalError] = useState("");

  // si haces f5 en /edit/:id y aun no se cargaron los contactos 
  useEffect(() => {
    if (isEdit && store.contacts.length === 0) loadContacts(dispatch);
  }, [isEdit, store.contacts.length, dispatch]);

  // si esta el contacto llenamos el formulario
  useEffect(() => {
    if (isEdit && existing) {
      setForm({
        name: existing.name || "",
        email: existing.email || "",
        phone: existing.phone || "",
        address: existing.address || "",
      });
    }
  }, [isEdit, existing]);

  function onChange(e) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLocalError("");

    if (!form.name.trim()) {
      setLocalError("Name is required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      address: form.address.trim(),
    };

    try {
      if (isEdit) await editContact(dispatch, id, payload);
      else await addContact(dispatch, payload);

      navigate("/");
    } catch (err) {
      setLocalError(err.message);
    }
  }

  return (
    <div className="container py-4">
      <h1 className="h4 mb-3">{isEdit ? "Edit contact" : "Add a new contact"}</h1>

      {store.error && <div className="alert alert-danger">{store.error}</div>}
      {localError && <div className="alert alert-warning">{localError}</div>}

      <form className="card card-body d-grid gap-3" onSubmit={onSubmit}>
        <input
          className="form-control"
          name="name"
          value={form.name}
          onChange={onChange}
          placeholder="Full Name"
        />
        <input
          className="form-control"
          name="email"
          value={form.email}
          onChange={onChange}
          placeholder="Email"
        />
        <input
          className="form-control"
          name="phone"
          value={form.phone}
          onChange={onChange}
          placeholder="Phone"
        />
        <input
          className="form-control"
          name="address"
          value={form.address}
          onChange={onChange}
          placeholder="Address"
        />

        <div className="d-flex gap-2">
          <button className="btn btn-primary" type="submit" disabled={store.loading}>
            {isEdit ? "Save changes" : "Save"}
          </button>
          <Link to="/" className="btn btn-outline-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
};
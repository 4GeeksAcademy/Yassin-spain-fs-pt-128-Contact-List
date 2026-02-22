import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { removeContact } from "../store";

export default function ContactCard({ contact }) {
  const { dispatch, store } = useGlobalReducer();

  // Referencia en el nodo del modal
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);

  // id unico para cada contacto
  const modalId = `deleteModal-${contact.id}`;
  const titleId = `deleteModalLabel-${contact.id}`;

  useEffect(() => {
    const Modal = window.bootstrap?.Modal;
    if (!Modal || !modalRef.current) return;

    bsModalRef.current = new Modal(modalRef.current, { backdrop: "static" });

    return () => {
      bsModalRef.current?.dispose();
    };
  }, []);

  function openModal() {
    bsModalRef.current?.show();
  }

  function closeModal() {
    bsModalRef.current?.hide();
  }

  async function confirmDelete() {
    await removeContact(dispatch, contact.id);
    closeModal();
  }

  return (
    <>
      <div className="list-group-item">
        <div className="row align-items-center py-2">
          <div className="col-auto">
            <img
                src="https://i.pravatar.cc/80?u=43s"
                className="rounded-circle"
                width="70"
                height="70"
                alt=""
            />
          </div>

          <div className="col">
            <div className="fw-bold">{contact.name}</div>
            <div className="text-muted small">{contact.address}</div>
            <div className="text-muted small">{contact.phone}</div>
            <div className="text-muted small">{contact.email}</div>
          </div>

          <div className="col-auto">
            <div className="d-flex gap-2">
              <Link to={`/edit/${contact.id}`} className="btn btn-outline-secondary btn-sm">
                Edit
              </Link>

              <button type="button" className="btn btn-outline-danger btn-sm" onClick={openModal}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal en el ContactCard */}
      <div
        className="modal fade"
        id={modalId}
        tabIndex="-1"
        aria-labelledby={titleId}
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={titleId}>
                Delete contact?
              </h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={closeModal} />
            </div>

            <div className="modal-body">
              <p className="mb-0">
                Are you sure you want to delete <strong>{contact.name}</strong>?
              </p>

              {/* error global del store */}
              {store.error ? <div className="alert alert-danger mt-3 mb-0">{store.error}</div> : null}
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
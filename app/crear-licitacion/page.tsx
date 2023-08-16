"use client";
import React, {
  useState,
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
} from "react";
import styles from "./CrearLicitacion.module.scss";
import Footer from "@/components/Footer/Footer";
import { Navbar } from "@/components/composed/Navbar/Navbar";
import { Button } from "@/components/Button/Button";
import { IconPlus, IconX, IconChevronDown } from "@tabler/icons-react";
import InputForm from "@/components/InputForm/InputForm";
import SwitchForm from "@/components/SwitchForm/SwitchForm";
import DynamicInputForm from "@/components/composed/DynamicInputForm/DynamicInputForm";
import DynamicFormModal from "@/components/composed/DynamicFormModal/DynamicFormModal";
import { TenderItem, Tender } from "@/constants/tender";
import Overlay from "@/components/Overlay/Overlay";

export default function CrearLicitacion(): JSX.Element {
  const [formState, setFormState] = useState<Tender>({
    txid: "",
    name: "",
    type: "Licitacion Pública",
    opening_date: "",
    currency: "",
    scope: "Argentina",
    requires_payment: false,
    allows_extension: false,
    categories: [""],
    quoteType: "Todos los items",
    additionalInfo: [], //Title and value of the custom input
    items: [],
    pliego: "", //IPFS Hash (PDF) - Pliego
    disposicionAprobatoria: "", //IPFS Hash (PDF)
    financialRequirements: "",
    technicalRequirements: "",
    administrativeRequirements: "",
    clause: ["", ""], //Documento, Numero GDE, Numero especial, Fecha vinculación -> [datos, IPFS Hash (PDF)]
    warranty: "",
    penalties: [""],
    annexes: [], //Title and IPFS Hash (PDF) of the annexes (array of tuples)
    dates: {
      inquiriesStart: "",
      inquiriesEnd: "",
      reveal: "",
      contractStart: "", // It should be "A partir del documento contractual"
      contractDuration: "", // E.g. "3 months"
    },
  });

  const [showFormModal, setShowFormModal] = useState(false);
  const [showTableRow, setShowTableRow] = useState(-1);

  const handleChange = (name: string, inputValue: any) => {
    setFormState({
      ...formState,
      [name]: inputValue,
    });
  };

  const handleDynamicInputChange = (name: string, dynamicInputs: string[]) => {
    setFormState({
      ...formState,
      [name]: dynamicInputs,
    });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formState);
  };

  const handleDynamicFormSubmit = (formData: TenderItem) => {
    formData.id = formState.items.length + 1;
    setFormState({
      ...formState,
      items: [...formState.items, formData],
    });
  };

  const handleDeleteRow = (index: number) => {
    const updatedItems = formState.items;
    updatedItems.splice(index, 1);
    setFormState({ ...formState, items: updatedItems });
  };

  const handleShowMore = (index: number) => {
    setShowTableRow(index);
  };

  return (
    <>
      {/* <Navbar /> */}
      <main className={styles.main}>
        <div className={styles.title}>
          <h3>Crear Licitación</h3>
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
          <InputForm
            value={formState.name}
            handleChange={handleChange}
            type="text"
            name="name"
            label="Nombre del proceso:"
            placeholder="Ej. Adquisición de ..."
          />
          <div className={styles.form_input}>
            <InputForm
              value={formState.currency}
              handleChange={handleChange}
              type="text"
              name="currency"
              label="Moneda y alcance:"
              placeholder="Pesos, Argentina"
            />
          </div>
          <div className={styles.form_compound}>
            <SwitchForm
              name="requires_payment"
              checked={formState.requires_payment}
              handleChange={handleChange}
              label="Requiere pago:"
            />
            <SwitchForm
              name="allows_extension"
              checked={formState.allows_extension}
              handleChange={handleChange}
              label="Se acepta prórroga:"
            />
          </div>
          <div className={styles.form_input}>
            <DynamicInputForm
              dynamicInputs={formState.categories}
              onDynamicInputChange={handleDynamicInputChange}
              type="text"
              name="categories"
              label="Rubro/s:"
              placeholder="Escribe un rubro, Ej. Pinturas"
            />
          </div>
          <div className={styles.form_input}>
            <h4>Detalle de productos o servicios</h4>
            <div className={styles.table_list}>
              <div className={styles.table_listHeader}>
                <h5>#</h5>
                <h5>Objeto del gasto</h5>
                <h5>Código del ítem</h5>
                <h5>Descripción</h5>
                <h5>Cantidad</h5>
              </div>
              <div className={styles.line}></div>
              {formState.items.map((item, index) => (
                <div className={styles.table_listRow} key={index}>
                  <p>{item.id}</p>
                  <p>{item.object}</p>
                  <p>{item.code}</p>
                  <p className={styles.description}>{item.description}</p>
                  <p>{item.quantity}</p>
                  <button
                    type="button"
                    onClick={() => handleShowMore(index)}
                    className={styles.table_listRowBtn}
                  >
                    <IconChevronDown />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(index)}
                    className={styles.table_listRowBtn}
                  >
                    <IconX />
                  </button>
                  {showTableRow === index && (
                    <div className={styles.expanded_row}>{index}</div>
                  )}
                  <div className={styles.line}></div>
                </div>
              ))}
            </div>
            {/* <div className={styles.btns_container}> */}
            <button
              onClick={() => setShowFormModal(true)}
              type="button"
              className={styles.table_button}
            >
              <IconPlus /> Añadir producto o servicio
            </button>

            {/* </div> */}
          </div>
          {/* <div>
            <label htmlFor=""></label>
            <input type="datetime-local" />
          </div> */}
          <div>
            <Button type="main">
              <IconPlus /> Crear licitacion
            </Button>
          </div>
        </form>
        {showFormModal && (
          <>
            <div>
              <DynamicFormModal
                onFormSubmit={handleDynamicFormSubmit}
                handleClose={() => setShowFormModal(false)}
              />
            </div>
            <Overlay handleClick={() => setShowFormModal(false)} />
          </>
        )}
      </main>
      <Footer />
    </>
  );
}
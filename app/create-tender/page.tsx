"use client";
import React, {
  useState,
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  useEffect,
} from "react";
import styles from "./CreateTender.module.scss";
import Footer from "@/components/Footer/Footer";
import { Navbar } from "@/components/composed/Navbar/Navbar";
import { Button } from "@/components/Button/Button";
import {
  IconPlus,
  IconX,
  IconChevronDown,
  IconWorld,
} from "@tabler/icons-react";
import InputForm from "@/components/InputForm/InputForm";
import SwitchForm from "@/components/SwitchForm/SwitchForm";
import DynamicInputForm from "@/components/composed/DynamicInputForm/DynamicInputForm";
import DynamicFormModal from "@/components/composed/DynamicFormModal/DynamicFormModal";
import { TenderItem, Tender } from "@/constants/tender";
import Overlay from "@/components/Overlay/Overlay";
import { Breadcrumb } from "@/components/Breadcrumb/Breadcrumb";
import { AnimatePresence, motion } from "framer-motion";
import { getEthereumPrice } from "@/utils/price";

export default function CreateTender(): JSX.Element {
  const [formState, setFormState] = useState<Tender>({
    txid: "",
    name: "",
    type: "Public tender",
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
  const [ethPrice, setEthPrice] = useState<number>(0);

  useEffect(() => {
    getEthereumPrice().then((price) => {
      setEthPrice(price);
    });
  }, []);

  const estimateCosts = () => {
    let totalCosts: number = 0;
    totalCosts += 0.0006 * ethPrice; // fees de red
    totalCosts += 20; // ethPrice; // timbrados
    return totalCosts;
  };

  const handleChange = (name: string, inputValue: any) => {
    setFormState({
      ...formState,
      [name]: inputValue,
    });
  };

  const handleDatesChange = (name: string, inputValue: any) => {
    setFormState({
      ...formState,
      dates: {
        ...formState.dates,
        [name]: inputValue,
      },
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
    if (showTableRow === index) {
      setShowTableRow(-1);
    } else {
      setShowTableRow(index);
    }
  };

  return (
    <>
      <Navbar />
      <section className={styles.breadcrumbs}>
        <Breadcrumb
          values={[
            ["Tenders", "/marketplace"],
            // ["Tender details", "/tender/"],
          ]}
        />
      </section>
      <main className={styles.main}>
        <div className={styles.title}>
          <h3>Create tender</h3>
        </div>
        <form onSubmit={(e) => handleSubmit(e)} className={styles.form}>
          <InputForm
            value={formState.name}
            handleChange={handleChange}
            type="text"
            name="name"
            label="Process name:"
            placeholder="E.g. Acquisition of ..."
          />
          <div className={styles.form_input}>
            <InputForm
              value={formState.currency}
              handleChange={handleChange}
              type="text"
              name="currency"
              label="Currency and scope"
              placeholder="Usd, Argentina"
            />
          </div>
          <div className={styles.form_compound}>
            <SwitchForm
              name="requires_payment"
              checked={formState.requires_payment}
              handleChange={handleChange}
              label="Requires payment:"
            />
            <SwitchForm
              name="allows_extension"
              checked={formState.allows_extension}
              handleChange={handleChange}
              label="Allows extension:"
            />
          </div>
          <div className={styles.form_input}>
            <DynamicInputForm
              dynamicInputs={formState.categories}
              onDynamicInputChange={handleDynamicInputChange}
              type="text"
              name="categories"
              label="Categories:"
              placeholder="Type a category, e.g. Paints"
            />
          </div>
          {/* <div className={styles.form_input}>
            <InputForm
              value={formState.quoteType}
              handleChange={handleChange}
              type="text"
              name="quoteType"
              label="Tipo de cotización"
              placeholder="Solo cotizacion por todos los items"
            />
          </div> */}
          <div className={styles.form_input}>
            <h4>Detail of products or services</h4>
            <div className={styles.table_list}>
              <div className={styles.table_listHeader}>
                <h5>#</h5>
                <h5>Object of expenditure</h5>
                <h5>Item code</h5>
                <h5>Description</h5>
                <h5>Quantity</h5>
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
                    <AnimatePresence>
                      <div className={styles.expanded_row}>
                        <motion.section
                          className={styles.table_moreInfo}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <h3>Additional information</h3>
                          <p>{item.additionalInfo}</p>
                          <h3>Place of delivery</h3>
                          <p>{item.deliveryPlace}</p>
                          <h3>Delivery deadline</h3>
                          <p>{item.deliveryDeadline}</p>
                        </motion.section>
                      </div>
                    </AnimatePresence>
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
              <IconPlus /> Add product or service
            </button>
          </div>
          <div className={styles.form_compound}>
            <InputForm
              type="file"
              value={formState.pliego}
              handleChange={handleChange}
              name="pliego"
              label="General terms and conditions"
            />
            <InputForm
              type="file"
              value={formState.disposicionAprobatoria}
              handleChange={handleChange}
              name="disposicionAprobatoria"
              label="Approval Provision"
            />
          </div>

          <div className={styles.form_input}>
            <h4>Minimum participation requirements</h4>
            <InputForm
              value={formState.financialRequirements}
              handleChange={handleChange}
              name="financialRequirements"
              label="1. Economic and financial requirements"
              placeholder="Description and document type"
            />
            <InputForm
              value={formState.technicalRequirements}
              handleChange={handleChange}
              name="technicalRequirements"
              label="2. Technical requirements"
              placeholder="Description and document type"
            />
            <InputForm
              value={formState.administrativeRequirements}
              handleChange={handleChange}
              name="administrativeRequirements"
              label="3. Administrative requirements"
              placeholder="Description and document type"
            />
          </div>
          <div className={styles.form_input}>
            <h4>Special clauses</h4>
            <div className={styles.form_compound}>
              <InputForm
                value={formState.clause[0]}
                handleChange={handleChange}
                name="clause"
                label="Document, Special Number, Linkage Date"
                placeholder="Enter the required data"
              />
              <InputForm
                type="file"
                value={formState.clause[1]}
                handleChange={handleChange}
                name="clause"
              />
            </div>
          </div>
          <div className={styles.form_input}>
            <InputForm
              value={formState.warranty}
              handleChange={handleChange}
              name="warranty"
              label="Warranties"
              placeholder="Enter the necessary data, e.g., guarantee of pre-award challenge, compliance, etc."
            />
          </div>
          <div className={styles.form_input}>
            <DynamicInputForm
              dynamicInputs={formState.penalties}
              onDynamicInputChange={handleDynamicInputChange}
              type="text"
              name="penalties"
              label="Penalties"
              placeholder="Penalty according to article, etc..."
            />
          </div>
          {/* Penalidades */}
          <div className={styles.form_input}>
            <h4>Additional information</h4>
            <div className={styles.form_compound}>
              <InputForm
                type="datetime-local"
                value={formState.dates.inquiriesStart}
                handleChange={handleDatesChange}
                name="inquiriesStart"
                label="Date and time of inquiries"
              />
              <div className={styles.form_compoundGap}>
                <p>To</p>
              </div>
              <InputForm
                type="datetime-local"
                value={formState.dates.inquiriesEnd}
                handleChange={handleDatesChange}
                name="inquiriesEnd"
              />
            </div>
            <InputForm
              type="datetime-local"
              value={formState.dates.reveal}
              handleChange={handleDatesChange}
              name="reveal"
              label="Date and time of reveal"
            />
            <div className={styles.form_compound}>
              <InputForm
                value={formState.dates.contractStart}
                handleChange={handleDatesChange}
                name="contractStart"
                label="Start of contract"
                placeholder="E.g. From the contractual document"
              />
              <InputForm
                value={formState.dates.contractDuration}
                handleChange={handleDatesChange}
                name="contractDuration"
                label="Contract duration"
                placeholder="E.g. 3 months"
              />
            </div>
          </div>
          <section className={styles.details_finalDetails}>
            <h3>Details</h3>
            <p>
              {/* Precio total: $ {getFormattedPrice()} {postData.currency}
              <br /> <br /> */}
              <b>Costs:</b> <br />
              Stamping: $20 USDC <br />
              Network fees: 0.0006 ETH
            </p>
            <h3>Estimated total: {estimateCosts()} USDC</h3>
          </section>
          <div className={styles.btn_submit}>
            <Button type="main">
              <IconPlus /> Create tender
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
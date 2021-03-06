import React, { useState, useEffect } from "react";
import NumberFormat from "react-number-format";
import { getAllActivity } from "../api/activity.api";
import { getQuotes } from "../api/cryptoactive.api";
import {activityToTransaction} from "../api/transaction";
import { Form, Button, Modal, Table } from "react-bootstrap";
import Navbar from "./NavBar";
import { useTranslation } from "react-i18next";

const Activity = () => {
  const [cryptoassets, setCryptoassets] = useState([]);

  const { t } = useTranslation();

  const [show, setShow] = useState(false);
  const[activitySelected,setActivitySelected]=useState({})
  const handleClose = () => setShow(false);
  const handleShow = (activity) => {setShow(true)
                            setActivitySelected(activity)};
  const [activity, setActivity] = useState([]);

  const getActivities = () => {
    getAllActivity()
      .then((result) => {
        console.log(result);

        setActivity(result.data);
      })
      .catch(console.log);
  };
  useEffect(() => {
    getActivities();
    getCryptoassets();
    console.log(activity);
  }, []);


  const getCryptoassets = () => { getQuotes().then((result) => {  setCryptoassets(result.data);})
      .catch(console.log);
  };

const effectTransaction=(activityId)=>{
      handleClose()
      activityToTransaction(activityId,localStorage.getItem("email"))
      window.location.reload()
}
  const formatCurrency = (number, locale) => {
    let currencyLocale = "";
    if (locale === "es-AR")   currencyLocale = "ARS";
    else currencyLocale = "USD";
    return new Intl.NumberFormat(locale, {style: "currency",currency: currencyLocale,}).format(number);
  };

  const cryptoactivePrice = (symbol) => {
    if(symbol == null ){
      return 0
    } else if(cryptoassets.length){
      const priceUSD = cryptoassets.find(crypto => crypto.symbol === symbol).price;
      return formatCurrency(priceUSD, "en-US");
    }
    
  }

  const priceInARS = (symbol, amount) => {
    if(symbol == null ){
      return 0;
    } else if(cryptoassets.length) {
    const crypto = cryptoassets.find(crypto => crypto.symbol === symbol);
    const priceARS = crypto.priceAr;
    return formatCurrency((priceARS * amount), "es-AR"); 
    }
  }

  const countOperations = (numberOperations) => {
    return (numberOperations > 0)? numberOperations : t("noOperations")
  }
  return (
    <>
      <Navbar />
      <h2>{t("buyAndSell")}</h2>
      <div>
        <Table className="table" responsive>
          <thead>
            <tr>
              <th>{t("numberOfOperations")}</th>
              <th>{t("hour")}</th>
              <th>{t("cryptoassets")}</th>
              <th>{t("amount")}</th>
              <th>{t("quotation")} </th>
              <th>{t("amountIn")}</th>
              <th>{t("name") + " y " + t("lastname")}</th>
              <th>{t("numberOfOperations")}</th>
              <th>{t("reputation")}</th>
              <th>{t("operation")}</th>
              <th>{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {activity.map((act) => {
              console.log(act)
              return (
                <tr key={act.id}>
                  <td>{act.id}</td>
                  <td>{act.hour}</td>
                  <td>{act.cryptoactive}</td>
                  <td>{act.cantidad}</td>
                  <td>{cryptoactivePrice(act.cryptoactive)}</td>
                  <td>{priceInARS(act.cryptoactive , act.cantidad)}</td>
                  <td>{act.fullNameUser}</td>
                  <td>{countOperations(act.numberOperations)}</td>

                  <td>{act.reputation}</td>

                  <td>{act.action}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      onClick={() => handleShow(act)}
                      disabled={act.emailUser === localStorage.getItem("email")}
                    >
                      {t(act.action)}
                    </Button>
                  </td>
                </tr>
              );
            })}
            <Modal show={show} onHide={handleClose}>
              <Modal.Header >
                <Modal.Title>{t("transaction")}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Table className="table" responsive>
                  <tbody>

                    <tr >
                      <td>{t("crypto")}</td>
                      <td>{activitySelected.cryptoactive}</td>
                    </tr>
                    <tr >
                      <td>{t("amount2")}</td>
                      <td>{priceInARS(activitySelected.cryptoactive , activitySelected.cantidad)}</td>
                    </tr>
                    <tr >
                      <td>{t("user")}</td>
                      <td>{activitySelected.fullNameUser}</td>
                    </tr>
                    <tr key={crypto.id}>
                      <td>{t("amount")}</td>
                      <td>{activitySelected.cantidad}</td>
                    </tr>
                    <tr key={crypto.id}>
                      <td>{t("reputation")}</td>
                      <td>{activitySelected.reputation}</td>
                    </tr>

                  </tbody>
                </Table>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                  {t("close")}
                </Button>
                <Button variant="primary" type="submit" onClick={()=>effectTransaction(activitySelected.id)}>
                  {t("accept")}
                </Button>
              </Modal.Footer>
            </Modal>
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default Activity;

"use client";
import React, { useState, useEffect } from "react";
import styles from "./CostsDetails.module.scss";
import { getEthereumPrice } from "@/utils/price";
import { useContractRead } from "wagmi";
import {
  contractABIGoerli,
  veritrustFactoryAddressGoerli,
} from "@/constants/factory";
import { ethers } from "ethers";

export default function CostsDetails({
  feeTypeToShow,
}: {
  feeTypeToShow: "contract" | "bid";
}) {
  const [ethPrice, setEthPrice] = useState<number>(0);
  const [totalCosts, setTotalCosts] = useState<string>("");
  const [fee, setFee] = useState<string | undefined>(undefined);

  const { data: deployFeeData } = useContractRead({
    address: veritrustFactoryAddressGoerli,
    abi: contractABIGoerli,
    functionName: "deployFee",
  });

  const { data: bidFeeData } = useContractRead({
    address: veritrustFactoryAddressGoerli,
    abi: contractABIGoerli,
    functionName: "bidFee",
  });

  useEffect(() => {
    let feeInt: Number = 0;
    if (feeTypeToShow == "contract") {
      feeInt = Number(deployFeeData);
    } else {
      feeInt = Number(bidFeeData);
    }
    const feeInEther = ethers.formatEther(feeInt.toString());
    setFee(feeInEther);
    let costs: number = 0;
    costs += 0.0008 * ethPrice; // network fees
    costs += (Number(feeInEther) / 10 ** 18) * ethPrice; // stamping or bid fee
    const costsStr = costs.toFixed(2);
    setTotalCosts(costsStr);
  }, [ethPrice, bidFeeData, deployFeeData, feeTypeToShow]);

  useEffect(() => {
    getEthereumPrice().then((price) => {
      setEthPrice(price);
    });
  }, []);

  return (
    <section className={styles.details_finalDetails}>
      <h3>Details</h3>
      <p>
        <b>Costs:</b> <br />
        {feeTypeToShow === "contract"
          ? `Stamping fee: ${fee} ETH `
          : `Bid fee: ${fee} ETH `}
        <br />
        Network fees: 0.0008 ??? ETH
      </p>
      <h3>Estimated total: {totalCosts} USD</h3>
    </section>
  );
}

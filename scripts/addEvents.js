const { ethers } = require("hardhat");

async function main() {
  const productAddress = "0xB27bBE5B8C2B6D0Feec09A6BAaDfA09C507cDfA3";
  const orgAddress = "0x04D6a69F9c08654c363B159009310f58ec2c81a4";

  const productContract = await ethers.getContractAt("Product", productAddress);
  const patoAddress = await productContract.getProductAtOrganization(orgAddress);
  
  const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";
  if (patoAddress === ADDRESS_ZERO) {
    throw new Error("No ProductAtOrganization exists for the given organization address.");
  }

  const patoContract = await ethers.getContractAt("ProductAtOrganization", patoAddress);

  const mockEvents = [
    {
      eventTime: "2025-03-19T12:00:00Z",
      typeEvent: "Shipping",
      jsonEvent: JSON.stringify({
        eventTime: "2025-03-19T12:00:00Z",
        eventTimeZoneOffset: "+00:00",
        epcList: ["urn:epc:id:sgtin:0614141.107346.2017"],
        bizStep: "urn:epcglobal:cbv:bizstep:shipping",
        disposition: "urn:epcglobal:cbv:disp:in_transit",
        readPoint: { id: "urn:epc:id:sgln:0614141.07346.1234" },
        bizLocation: { id: "urn:epc:id:sgln:0614141.07346.0" },
        bizTransactionList: [
          { type: "urn:epcglobal:cbv:btt:po", id: "http://transaction.acme.com/po/12345678" }
        ]
      })
    },
    {
      eventTime: "2025-03-19T13:00:00Z",
      typeEvent: "Receiving",
      jsonEvent: JSON.stringify({
        eventTime: "2025-03-19T13:00:00Z",
        eventTimeZoneOffset: "+00:00",
        epcList: ["urn:epc:id:sgtin:0614141.107346.2018"],
        bizStep: "urn:epcglobal:cbv:bizstep:receiving",
        disposition: "urn:epcglobal:cbv:disp:available",
        readPoint: { id: "urn:epc:id:sgln:0614141.07346.5678" },
        bizLocation: { id: "urn:epc:id:sgln:0614141.07346.1" },
        bizTransactionList: [
          { type: "urn:epcglobal:cbv:btt:po", id: "http://transaction.acme.com/po/87654321" }
        ]
      })
    },
    {
      eventTime: "2025-03-19T14:00:00Z",
      typeEvent: "Shipping",
      jsonEvent: JSON.stringify({
        eventTime: "2025-03-19T14:00:00Z",
        eventTimeZoneOffset: "+00:00",
        epcList: ["urn:epc:id:sgtin:0614141.107346.2019"],
        bizStep: "urn:epcglobal:cbv:bizstep:shipping",
        disposition: "urn:epcglobal:cbv:disp:in_transit",
        readPoint: { id: "urn:epc:id:sgln:0614141.07346.9876" },
        bizLocation: { id: "urn:epc:id:sgln:0614141.07346.2" },
        bizTransactionList: [
          { type: "urn:epcglobal:cbv:btt:po", id: "http://transaction.acme.com/po/11223344" }
        ]
      })
    }
  ];

  for (const event of mockEvents) {
    console.log(`Adding event at ${event.eventTime} with type ${event.typeEvent} to PATO contract at: ${patoAddress}`);
    const tx = await patoContract.addEvent(event.eventTime, event.typeEvent, event.jsonEvent);
    console.log("Transaction sent. Waiting for confirmation...");
    const receipt = await tx.wait();
    console.log("Event added successfully. Transaction receipt:");
    console.log(receipt);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error("Error adding event:", error);
    process.exit(1);
  });

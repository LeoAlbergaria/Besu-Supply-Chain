import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import {
  FiPlus,
  FiTruck,
  FiHome,
  FiArchive,
  FiCheck,
  FiPackage,
  FiMapPin,
  FiUpload,
  FiDownload,
  FiAlertCircle,
  FiSend,
} from "react-icons/fi";
import { Colors, Metrics } from "../styles";
import Header from "../components/Header.js";
import Title from "../components/Title.js";

import { ethers } from "ethers";

import ProductArtifact from "../artifacts/contracts/Product.sol/Product.json";
import ProductAtOrganizationArtifact from "../artifacts/contracts/ProductAtOrganization.sol/ProductAtOrganization.json";

// Icon map
const iconMap = {
  FiPlus: <FiPlus />,
  FiTruck: <FiTruck />,
  FiHome: <FiHome />,
  FiArchive: <FiArchive />,
  FiCheck: <FiCheck />,
  FiPackage: <FiPackage />,
  FiMapPin: <FiMapPin />,
  FiUpload: <FiUpload />,
  FiDownload: <FiDownload />,
  FiAlertCircle: <FiAlertCircle />,
  FiSend: <FiSend />,
};

// (Optional) map event types to an icon key; unknown types fall back to FiPackage
function iconKeyForType(typeEvent) {
  if (!typeEvent) return "FiPackage";
  const t = typeEvent.toLowerCase();
  if (t.includes("create")) return "FiPlus";
  if (t.includes("ship")) return "FiTruck";
  if (t.includes("store") || t.includes("warehouse")) return "FiArchive";
  if (t.includes("quality") || t.includes("check") || t.includes("complete"))
    return "FiCheck";
  if (t.includes("dispatch") || t.includes("send")) return "FiSend";
  if (t.includes("receive") || t.includes("received")) return "FiDownload";
  if (t.includes("process")) return "FiUpload";
  if (t.includes("location") || t.includes("pin")) return "FiMapPin";
  if (t.includes("delay") || t.includes("alert") || t.includes("warn"))
    return "FiAlertCircle";
  return "FiPackage";
}

export default function ProductDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const [openCompanies, setOpenCompanies] = useState({});
  const [productName, setProductName] = useState("");
  const [timeline, setTimeline] = useState([]); // [{ orgAdress, timestamp, events: [{ typeEvent, timeEvent, jsonEvent, iconKey, paoAddr }] }]
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (!product?.address || !window.ethereum) return;

    (async () => {
      setLoading(true);
      setErrMsg("");
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        console.log("Product Addr:", product.address);
        const productContract = new ethers.Contract(
          product.address,
          ProductArtifact.abi,
          signer
        );

        // Try to fetch product name if available
        try {
          if (productContract.getName) {
            const name = await productContract.getName();
            if (name) setProductName(String(name));
          }
        } catch {
          // ignore if method not present
        }

        // 1) Get orgs from ownership history
        const ownershipHistory = await productContract.getOwnershipHistory();
        const orgs = ownershipHistory
          .map(
            (e) => e.organization ?? e.organizationAddress ?? e.owner ?? e[0]
          )
          .filter(Boolean);

        // dedupe
        const uniqueOrgs = [
          ...new Map(orgs.map((a) => [a.toLowerCase(), a])).values(),
        ];

        // 2) For each org → get PAO → getEvents(org) → map to UI rows
        const rowsByOrg = await Promise.all(
          uniqueOrgs.map(async (org) => {
            try {
              const paoAddr = await productContract.getProductAtOrganization(
                org
              );
              const code = await provider.getCode(paoAddr);
              console.log(
                `Org ${org} → PAO ${paoAddr} (has code? ${code !== "0x"})`
              );
              if (!code || code === "0x") return null;

              const pao = new ethers.Contract(
                paoAddr,
                ProductAtOrganizationArtifact.abi,
                signer
              );

              // Contract view: getEvents(address organizationAddress) returns EventInfo[]
              const raw = await pao.getEvents(org);

              const events = raw.map((ev) => {
                const typeEvent = ev.typeEvent ?? ev[2];
                const timeEvent = ev.timeEvent ?? ev[1];
                const jsonEvent = ev.jsonEvent ?? ev[0];
                const iconKey = iconKeyForType(typeEvent);
                return { orgAdress: org, typeEvent, timeEvent, jsonEvent, iconKey, paoAddr };
              });

              // choose a header timestamp: most recent timeEvent (fallback to first)
              const headerTs =
                (events.length && (events[events.length - 1].timeEvent || events[0].timeEvent)) ||
                "";

              return { orgAdress: org, timestamp: headerTs, events };
            } catch (e) {
              console.error(`Failed getEvents for org ${org}:`, e);
              return null;
            }
          })
        );

        // Filter out nulls and empty event groups
        const timelineData = rowsByOrg
          .filter(Boolean)
          .filter((g) => g.events && g.events.length > 0);

        setTimeline(timelineData);
      } catch (err) {
        console.error("Failed to load real events:", err);
        setErrMsg(String(err?.message || err));
      } finally {
        setLoading(false);
      }
    })();
  }, [product?.address]);

  const toggleCompany = (orgAdress) => {
    setOpenCompanies((prev) => ({
      ...prev,
      [orgAdress]: !prev[orgAdress],
    }));
  };

  const handleViewDetails = (ev) => {
  // drop only the UI icon, keep jsonEvent and the rest
  const { iconKey, ...eventWithoutIcon } = ev;

  // if jsonEvent might be an object, make sure it’s serializable (optional)
  if (eventWithoutIcon.jsonEvent && typeof eventWithoutIcon.jsonEvent !== 'string') {
    try {
      eventWithoutIcon.jsonEvent = JSON.stringify(eventWithoutIcon.jsonEvent);
    } catch (_) {
      // ignore if it can't stringify; EventDetails will handle it
    }
  }

  navigate(`/event/${ev.typeEvent}`, { state: { event: eventWithoutIcon } });
};

  return (
    <>
      <Header />
      <div
        style={{
          padding: "20px 160px",
          backgroundColor: Colors.background,
          minHeight: "100vh",
        }}
      >
        {/* Back Button */}
        <div
          onClick={() => navigate(-1)}
          style={{ marginBottom: 16, cursor: "pointer" }}
        >
          <FiChevronLeft size={32} />
        </div>

        <div style={{ padding: Metrics.padding.standard }}>
          <Title
            title="Product Details"
            subtitle={productName || product?.address || "—"}
            description={`View on-chain timeline for this product${
              product?.address ? ` (${product.address})` : ""
            }.`}
          />
        </div>

        <div style={{ padding: Metrics.padding.standard }}>
          <h3 style={{ fontWeight: "bold", color: Colors.textMain }}>
            Product Timeline
          </h3>

          {loading && (
            <div style={{ marginTop: 12, color: Colors.textSecondary }}>
              Loading events…
            </div>
          )}
          {errMsg && (
            <div style={{ marginTop: 12, color: Colors.error }}>
              {errMsg}
            </div>
          )}

          {!loading && !errMsg && timeline.length === 0 && (
            <div style={{ marginTop: 12, color: Colors.textSecondary }}>
              No events found.
            </div>
          )}

          {!loading && !errMsg && timeline.length > 0 && (
            <div
              style={{
                marginTop: 16,
                borderLeft: `2px solid ${Colors.border}`,
                paddingLeft: 16,
              }}
            >
              {timeline.map((entry, index) => (
                <div key={entry.orgAdress || index} style={{ marginBottom: 24 }}>
                  <div onClick={() => toggleCompany(entry.orgAdress)}>
                    <div
                      style={{
                        cursor: "pointer",
                        display: "flex",
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <FiHome size={16} color={Colors.textMain} />
                      <span
                        style={{ fontWeight: "600", color: Colors.textMain }}
                        title={entry.orgAdress}
                      >
                        {entry.orgAdress}
                      </span>
                    </div>
                    <div
                      style={{
                        marginLeft: 24,
                        color: Colors.textSecondary,
                        fontSize: 14,
                        wordBreak: "break-word",
                      }}
                    >
                      {entry.timestamp}
                    </div>
                  </div>

                  {openCompanies[entry.orgAdress] &&
                    entry.events &&
                    entry.events.length > 0 && (
                      <div
                        style={{
                          marginTop: 12,
                          marginLeft: 32,
                          borderLeft: `1px solid ${Colors.border}`,
                        }}
                      >
                        {entry.events.map((event, idx) => (
                          <div
                            key={`${entry.orgAdress}-${idx}`}
                            style={{ paddingLeft: 16, marginBottom: 16 }}
                            onClick={() => handleViewDetails(event)}
                          >
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 8,
                              }}
                            >
                              {iconMap[event.iconKey] || iconMap.FiPackage}
                              <span
                                style={{ fontWeight: 500, color: Colors.textMain }}
                              >
                                {event.typeEvent}
                              </span>
                            </div>
                            <div style={{ color: Colors.textSecondary, fontSize: 14 }}>
                              {event.timeEvent}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

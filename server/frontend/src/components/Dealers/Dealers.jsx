import React, { useState, useEffect } from 'react';
import "./Dealers.css";
import "../assets/style.css";
import Header from '../Header/Header';
import review_icon from "../assets/reviewicon.png"

const Dealers = () => {
  const [dealersList, setDealersList] = useState([]);
  const [allDealers, setAllDealers] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");

  const dealer_url = "/djangoapp/dealers";

  const filterDealers = (state) => {
    setSelectedState(state);
    if (!state || state === "All") {
      setDealersList(allDealers);
      return;
    }
    setDealersList(allDealers.filter((dealer) => dealer.state === state));
  };

  const get_dealers = async () => {
    const res = await fetch(dealer_url);
    if (!res.ok) {
      console.error("Failed to fetch dealers", res.status, res.statusText);
      return;
    }
    const all_dealers = await res.json();
    if (!Array.isArray(all_dealers)) {
      console.error("Unexpected dealers response", all_dealers);
      return;
    }

    setAllDealers(all_dealers);
    setDealersList(all_dealers);

    const uniqueStates = [...new Set(all_dealers.map((dealer) => dealer.state))].sort();
    setStates(uniqueStates);
  };

  useEffect(() => {
    get_dealers();
  },[]);

  const isLoggedIn = sessionStorage.getItem("username") != null;

  return (
    <div className="dealers-page">
      <Header />
      <main className="dealers-main">
        <div className="dealers-toolbar">
          <div>
            <h1>Dealerships</h1>
            <p className="dealers-summary">Showing {dealersList.length} dealer{dealersList.length === 1 ? '' : 's'}</p>
          </div>
          <div className="dealers-filter">
            <label htmlFor="state">Filter by state</label>
            <select id="state" value={selectedState} onChange={(e) => filterDealers(e.target.value)}>
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="dealer-grid">
          {dealersList.map((dealer) => (
            <article key={dealer.id} className="dealer-card">
              <div className="dealer-card-header">
                <div>
                  <a className="dealer-name" href={`/dealer/${dealer.id}`}>{dealer.full_name}</a>
                  <p className="dealer-location">{dealer.city}, {dealer.state} {dealer.zip}</p>
                </div>
                {isLoggedIn && (
                  <a className="dealer-review-link" href={`/postreview/${dealer.id}`}>
                    <img src={review_icon} className="review_icon" alt="Post Review" />
                  </a>
                )}
              </div>
              <div className="dealer-card-body">
                <p><strong>Address:</strong> {dealer.address}</p>
                {dealer.st === undefined && dealer.address === undefined ? null : null}
                <p><strong>ID:</strong> {dealer.id}</p>
                {dealer.phone && <p><strong>Phone:</strong> {dealer.phone}</p>}
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Dealers

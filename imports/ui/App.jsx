import React, { useCallback, useEffect, useRef, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import Message from "./message";

export const App = () => {
  const [messages, setMessages] = useState([]);
  const [pause, setPause] = useState(false);
  const [fetch, setFetch] = useState(false);
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [type, setType] = useState("");
  const [source, setSource] = useState("source");
  const [date, setDate] = useState(1);
  const [more, setMore] = useState(true);
  const [filters, setFilters] = useState({});
  const [options, setOptions] = useState({ limit, skip });

  const observer = useRef();

  const lastMessage = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries =>{
        if (entries[0].isIntersecting) {
          console.log(node);
          setMore(m=> !m)
        }
      }))
      if (node) observer.current.observe(node)
    },
    [filters, options]
  );

  useEffect(() => {
    setMessages([]);
  }, [filters, options]);

  useEffect(() => {
    Meteor.call("fetchMessages", filters, options, (err, res) =>
      setMessages((prev) => {
        return [...new Set([...prev, ...res])];
      })
    );
    console.log("filters or options have change");
    console.log(filters);
    console.log(messages);
  }, [filters, options , more]);

  console.log(messages);

  return (
    <>
      <div className="container">
        <h1>Infinite Scroll</h1>
        <div className="filters">
          filter by {type}
          <button
            onClick={() => setFilters({ ...filters, type: "info" })}
            className=" btn-filter"
            type="submit"
          >
            Filter by info
          </button>
          <button
            onClick={() => setFilters({ ...filters, type: "error" })}
            className="btn-filter "
            type="submit"
          >
            Filter by error
          </button>
          <button
            onClick={() => setFilters({ ...filters, type: "warning" })}
            className="btn-filter "
            type="submit"
          >
            Filter by warning
          </button>
          <button
            onClick={() => setFilters({ ...filters, type: "verbose" })}
            className="btn-filter "
            type="submit"
          >
            Filter by verbose
          </button>
          filter by {source}
          <button
            onClick={() => setFilters({ ...filters, source: "client" })}
            className=" btn-filter"
            type="submit"
          >
            Filter by client
          </button>
          <button
            onClick={() => setFilters({ ...filters, source: "server" })}
            className="btn-filter "
            type="submit"
          >
            Filter by server
          </button>
          filter by {date == 1 ? "ascending" : "descending"}
          <button
            onClick={() => setOptions({ ...options })}
            className=" btn-filter"
            type="submit"
          >
            Filter ascending
          </button>
          <button
            onClick={() => setOptions({ ...options })}
            className="btn-filter "
            type="submit"
          >
            Filter descending
          </button>
          <h3>only {options.limit} Messages will be fetched every time </h3>
          <input
            placeholder="change the limit"
            type="number"
            onChange={(e) =>
              setOptions({ ...options, limit: e.target.valueAsNumber })
            }
            id=""
          />
          <h3>only {skip} Messages will be skiped every time </h3>
          <input
            placeholder="change the limit"
            type="number"
            onChange={(e) =>
              setOptions({ ...options, skip: e.target.valueAsNumber })
            }
            id=""
          />
        </div>

        <button
          onClick={() => setPause(!pause)}
          className="btn-pause"
          type="submit"
        >
          {pause == true ? "sync data" : " Stop sync data"}
        </button>
        {messages?.map((message, index) => {
          if (messages.length === index + 1) {
            return (<div ref={lastMessage} ><Message message={message} key={index} /></div>);
          } else {
            return <Message message={message} key={index} />;
          }
          
        })}
        <div>iam the last</div>
      </div>
      <div className="loading">
        <div className="ball first"></div>
        <div className="ball second"></div>
        <div className="ball third"></div>
      </div>
    </>
  );
};

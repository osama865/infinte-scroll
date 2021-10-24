import React, { useCallback, useEffect, useRef, useState } from "react";
import { Meteor } from "meteor/meteor";
import Message from "./message";

export const App = () => {
  const [messages, setMessages] = useState([]);
  const [pause, setPause] = useState(true);
  const [limit, setLimit] = useState(10);
  const [skip, setSkip] = useState(0);
  const [type, setType] = useState("");
  const [source, setSource] = useState("source");
  const [date, setDate] = useState(1);
  const [more, setMore] = useState(true);
  const [filters, setFilters] = useState({});
  const [options, setOptions] = useState({
    limit,
    skip,
    sort: { createdAt: date },
  });

  const scrollUp = ()=>{
    window.scrollTo(0,0)
  }

  const observer = useRef();
  const lastMessage = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();
      // declare a new observer and check if it is interscting or appeared in the view
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setSkip((prev) => prev + limit);
          setMore((m) => !m);
        }
      });
      if (node) observer.current.observe(node);
    },
    // whenever these deps changes , run the callback
    [filters, options]
  );

  // tiny useEffect to ensure no duplicate by removing previous messages
  useEffect(() => {
    setMessages([]);
    setSkip(0)
    setOptions({...options , skip : 0})
  }, [filters , type]);

  // When ever the filters , options or More states is changed the effect will happn
  useEffect(() => {
    // pause is for stop fetch more data or not
    const op = options;
    op.skip = skip;
    setOptions(op);
    console.log(options);

    if (pause) {
      Meteor.subscribe("messages");
      Meteor.call("fetchMessages", filters, options, (err, res) => {
        if (err) {
          console.error(err);
          throw new Error(
            "an Error occure while fetching the messages , please check the log for more info"
          );
        }
        // other wise what will happen is compinig the new messages with the perv
        // and make sure all the messages is uniqe and there is no duplication using Set()
        setMessages((prev) => {
          return [...new Set([...prev, ...res])];
        });
      });
    }
  }, [filters, options, more, date]);

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
            onClick={() => setOptions({ ...options, sort: { createdAt: 1 } })}
            className=" btn-filter"
            type="submit"
          >
            Filter ascending
          </button>
          <button
            onClick={() => setOptions({ ...options, sort: { createdAt: -1 } })}
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
          <h3>only {options.skip} Messages will be skiped every time </h3>
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
          onClick={() => setPause(pause == true ? false : true)}
          className="btn-pause"
          type="submit"
        >
          {pause === true ? " Stop sync data" : "sync data"}
        </button>
        
        <button className="float" onClick={scrollUp} >UP</button>

        {messages?.map((message, i) => {
          if (i + 1 === messages.length) {
            return (
              <div ref={lastMessage}>
                <Message message={message} key={i} />
              </div>
            );
          }
          return <Message message={message} key={i} />;
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

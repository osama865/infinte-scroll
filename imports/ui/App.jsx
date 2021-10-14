import React, { useCallback, useEffect, useRef, useState } from "react";
import { Meteor } from "meteor/meteor";
import { useTracker } from "meteor/react-meteor-data";
import Message from "./message";

/*
hello Pavel
it's been a while and im very sorry for my slow progress and i'll tell you why
now i've just finished the task you asked and i deployed it on galaxy platform
and here the app link :

and here is the github link :
https://github.com/osama865/infinte-scroll
ill explain why it took me two weeks to do it
first of all i didn't use any third party libraries to implement the infinite scroll concepts
Second, I did it last week but I realized that my approach is a little bit wrong
i was using an event listener ("scroll") event and it was pretty good
the problem was that approach causes a serious performance issue to the app because it will listen to every user scroll !
so i had to come with another solution
so i did it now with intersection observer
it's simple and powerful idea and it worked good and no performance issues appeared




‫في الأحد، 3 أكتوبر 2021 في 3:33 م تمت كتابة ما يلي بواسطة ‪Osama Ibrahim‬‏ <‪osama0000ibrahim@gmail.com‬‏>:‬

    I have completed more than half the project and as an estimation I think by the end of the week and I think we'll have another call right ? Should we schedule it now or later? 


    On Thu, Sep 30, 2021, 1:44 PM Osama Ibrahim <osama0000ibrahim@gmail.com> wrote:

        The direction sort filter and filter by limit , can you explain what exactly these filters should do ?

        On Thu, Sep 30, 2021, 1:51 PM Pavel Dibin <dibinpv@innmind.com> wrote:

            Hi Osama, 

            Please see the comments bellow:  

            Thanks, 
            Pavel
            On 29 Sep 2021, 12:02 +0300, Osama Ibrahim <osama0000ibrahim@gmail.com>, wrote:

                hello pavel ,
                i read the task and here what i understood , please correct me if im wrong
                you need something like infinty scrool that whenever you scrool down you get more data
                and the data wold be messages in the databse has the following schema
                {
                text ,
                source ,
                date ,
                type ,
                }

                after implement the lazy conetent loading you want to add filters to filter the fetched messages
                default will be all the messages will be fetched otherwise only messages that matched
                the filter you desire will be fetched
                i understood all filters you ask but i didn't with filter by limit and direction of sorting ? can you explain these two for me ? Sorry didn’t get your question
                pause on/off to stop fetching more data from the server right ? Yes 
                you have data for the messages or i should make them ? You can generate the data by yourself. 




                ‫في الاثنين، 27 سبتمبر 2021 في 9:58 ص تمت كتابة ما يلي بواسطة ‪Pavel Dibin‬‏ <‪dibinpv@innmind.com‬‏>:‬

                    Hello Osama,

                    As we discussed on our previous call I am sending a test task. 
                    Please, review the task in the attached file and give me an estimation.
                    Don’t hesitate to ask any questions!
                    Thanks, 
                    Pavel

                    Thanks, 
                    Pavel


 */

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
  }, [filters, options]);

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

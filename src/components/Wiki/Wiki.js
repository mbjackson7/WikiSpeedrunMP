// https://www.npmjs.com/package/html-react-parser

import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components/macro";
import {
  addToHistory,
  endGame,
  selectEndingArticle,
  selectHistory,
  selectStartingArticle,
} from "../../redux/settingsSlice";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./wiki-common.css";
import "./wiki-vec2.css";
import Result from "../Result";
import { StopwatchContext } from "../Stopwatch/StopwatchContext";
import useDidMountEffect from "../../hooks/useDidMountEffect";
import WikiLogic from "./WikiLogic";
import { LoadingOverlay } from "@mantine/core";

function WikiRenderer() {
  let params = useParams();
  const dispatch = useDispatch();
  const ref = useRef();
  const stopwatch = useContext(StopwatchContext);

  const [wikiData, setWikiData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setshowResults] = useState(false);

  const startTitle = useSelector(selectStartingArticle).title;
  const endTitle = useSelector(selectEndingArticle).title;
  const history = useSelector(selectHistory);

  const { handleWikiArticleClick } = WikiLogic();

  const search = async (searchString) => {
    setIsLoading(true);
    const resp = await axios.get(`https://en.wikipedia.org/w/api.php`, {
      params: {
        page: searchString,
        origin: "*",
        action: "parse",
        format: "json",
        disableeditsection: "true",
        redirects: "true", // automatically redirects from plural form
      },
    });
    const html = resp.data.parse.text["*"];
    const title = resp.data.parse.title;
    const pageid = resp.data.parse.pageid;
    setWikiData({ html, title, pageid });
    setIsLoading(false);
  };

  // track user history
  useDidMountEffect(() => {
    if (wikiData.title) {
      let time = stopwatch.getCurrentTime();

      // workaround for the first entry being logged slightly later than 0
      if (history.length === 0) {
        time.ms = "000";
      }
      dispatch(addToHistory({ title: wikiData.title, time }));
    }
  }, [wikiData.title]);

  // pause timer while article is loading
  useDidMountEffect(() => {
    isLoading ? stopwatch.pauseTimer() : stopwatch.startTimer();
  }, [isLoading]);

  // render initial wiki article
  useEffect(() => {
    search(startTitle).catch((e) =>
      console.error(`Couldnt fetch wiki data: ${e.message}`)
    );
    stopwatch.resetTimer();
    stopwatch.startTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startTitle]);

  // render article from route parameters
  useEffect(() => {
    if (params.wikiTitle) {
      search(params.wikiTitle).catch((e) =>
        console.error(`Couldnt fetch wiki data: ${e.message}`)
      );
    }
  }, [params.wikiTitle]);

  // track winning condition
  useEffect(() => {
    if (endTitle === wikiData.title) {
      stopwatch.pauseTimer();
      stopwatch.disableTimer(true);
      dispatch(endGame());
      setshowResults(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endTitle, wikiData]);

  function createMarkup() {
    return { __html: wikiData.html };
  }

  return (
    <>
      <HeaderGoal>
        {startTitle} → {endTitle}
      </HeaderGoal>
      <WikiWrapper>
        {/* <button onClick={() => setshowResults(true)}>Win</button> */}
        <Result isOpen={showResults} onDismiss={() => setshowResults(false)} />
        <LoadingOverlay visible={isLoading} />
        <>
          <HeaderWrapper>
            <WikiHeader>{wikiData.title}</WikiHeader>
          </HeaderWrapper>
          <div
            ref={ref}
            onClick={handleWikiArticleClick}
            className="wiki-insert"
            dangerouslySetInnerHTML={createMarkup()}
          />
        </>
      </WikiWrapper>
    </>
  );
}

const WikiWrapper = styled.div`
  overflow: auto;
  margin-left: var(--border-gap);
  margin-top: 16px;
  padding-right: var(--border-gap);
  font-family: sans-serif;
  
  
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: baseline;
  border-bottom: 1px solid #a2a9b1;
  margin-bottom: 0.25em;
  padding-top: 16px;
`;

const HeaderGoal = styled.span`
  font-size: ${18 / 16}rem;
  font-weight: 400;
  margin-left: var(--border-gap);
  margin-top: 8px;
`;
export const WikiHeader = styled.h2`
  font-size: 1.8rem;
  font-weight: 400;
  font-family: "serif";
`;
export default WikiRenderer;
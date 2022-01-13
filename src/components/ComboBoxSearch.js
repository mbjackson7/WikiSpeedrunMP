import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import useDebounce from "../hooks/useDebounce";

const ComboBoxSearch = ({ inputId, selectHandler }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebounce(searchTerm, 600);

  const [articles, setArticles] = useState([]);

  const search = async () => {
    const { data } = await axios.get("https://en.wikipedia.org/w/api.php", {
      params: {
        action: "query",
        list: "search",
        origin: "*",
        format: "json",
        srsearch: debouncedTerm,
      },
    });
    if (data.query) {
      setArticles(data.query.search);
    }
  };

  useEffect(() => {
    if (debouncedTerm !== "") {
      search();
    }
  }, [debouncedTerm]);

  const handleSearchTermChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Combobox
      onSelect={(item) => selectHandler(item)}
      aria-label="Article Search"
    >
      <ComboboxInput
        onChange={handleSearchTermChange}
        placeholder="Search..."
        id={inputId}
      />
      {articles && (
        <ComboboxPopover className="shadow-popup">
          {articles.length > 0 ? (
            <ComboboxList>
              {articles.map((article) => {
                return (
                  <ComboboxOption key={article.pageid} value={article.title} />
                );
              })}
            </ComboboxList>
          ) : (
            <span style={{ display: "block", margin: 8 }}>
              No results found
            </span>
          )}
        </ComboboxPopover>
      )}
    </Combobox>
  );
};

ComboBoxSearch.propTypes = {
  inputId: PropTypes.string.isRequired,
  selectHandler: PropTypes.func.isRequired,
};

export default ComboBoxSearch;

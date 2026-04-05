import { InputGroup, Button, ListGroup, Form, Collapse } from "react-bootstrap";
import type { Bof } from "../types";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import "./SearchForm.css";
import { searchBofs } from "../utils/search";
import { Search } from "react-bootstrap-icons";
import { AdvancedSearchForm } from "./AdvancedSearchForm";

type SearchFormProps = {
  allBofs: Bof[];
  onSelect: (item: Bof | null) => void;
};

export function SearchForm({ allBofs, onSelect }: SearchFormProps) {
  const [show, setShow] = useState(false);
  const [query, setQuery] = useState("");
  const [pos, setPos] = useState(0);
  const [placeholder, setPlaceholder] = useState("Search for BOFs...");
  const debouncedQuery = useDebounce(query);

  const [showAdvanced, setShowAdvanced] = useState(false);
  const [fields, setFields] = useState<(keyof Bof)[]>(["name"]);
  const [matchLogic, setMatchLogic] = useState<"any" | "all">("any");

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const filtered = useMemo(() => {
    const result = searchBofs(allBofs, debouncedQuery, fields, matchLogic);

    // Add exact `name` matches to the top of search results
    result.sort((a, b) => {
      const aMatch = a.name.toLowerCase() === debouncedQuery.toLowerCase();
      const bMatch = b.name.toLowerCase() === debouncedQuery.toLowerCase();

      if (aMatch && !bMatch) return -1;
      if (bMatch && !aMatch) return 1;

      // Sort by name alphabetically
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    return result;
  }, [debouncedQuery, allBofs, fields, matchLogic]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(() => e.target.value);
  };

  function selectBof(bof: Bof) {
    setQuery(() => "");
    setShow(false);
    setPlaceholder(bof.name);
    onSelect(bof);
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!show) setShow(true);

    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (e.key === "ArrowDown") {
        if (pos + 1 <= filtered.length) {
          setPos((prev) => prev + 1);
        }
      } else {
        if (pos - 1 > 0) {
          setPos((prev) => prev - 1);
        }
      }
      return;
    }

    if (e.key === "Enter") {
      if (
        filtered.length === 1 ||
        filtered[0].name.toLowerCase() === debouncedQuery.toLowerCase()
      ) {
        selectBof(filtered[0]);
      } else if (pos > 0) {
        selectBof(filtered[pos - 1]);
      } else if (filtered.length > 0) {
        setPos(1);
      }
    }

    if (e.key === "Escape") {
      e.currentTarget.blur();
    }
  };

  const handleClick = (bof: Bof) => {
    selectBof(bof);
  };

  // Ensure highlighted item is in view.
  useEffect(() => {
    let el = itemRefs.current[pos + 1];
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
    el = itemRefs.current[pos - 1];
    if (el) {
      el.scrollIntoView({ block: "nearest" });
    }
  }, [pos]);

  return (
    // Add outer div to respect padding
    <div>
      <div className="bof-search">
        <InputGroup>
          <Form.Control
            placeholder={placeholder}
            onChange={handleInput}
            onFocus={() => {
              setShow(true);
              setShowAdvanced(false);
              setPlaceholder("Search for BOFs...");
            }}
            onBlur={() => {
              setShow(false);
              setPos(0);
            }}
            onKeyDown={handleKeyDown}
            value={query}
          />
          <Button
            variant={showAdvanced ? "secondary" : "primary"}
            className="d-flex align-items-center"
            active={!showAdvanced}
            onClick={() => setShowAdvanced((e) => !e)}
          >
            <Search />
          </Button>
        </InputGroup>
        {show && filtered.length >= 1 && (
          <ListGroup className="dropdown">
            <div className="dropdown-scroll">
              {filtered.map((item, index) => (
                <ListGroup.Item
                  onMouseDown={() => handleClick(item)}
                  key={item.name}
                  active={index === pos - 1 || filtered.length === 1}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  className="d-flex justify-content-between"
                >
                  <span>{item.name}</span>
                  <small className="text-muted">({item.kit})</small>
                </ListGroup.Item>
              ))}
            </div>

            <ListGroup.Item
              className="text-muted small dropdown-msg"
              key="_confirm"
              ref={(el) => {
                itemRefs.current[filtered.length] = el;
              }}
            >
              {filtered.length === 1 || pos > 0
                ? "Enter to accept"
                : "↑↓ to go through list"}
            </ListGroup.Item>
          </ListGroup>
        )}
      </div>
      <Collapse in={showAdvanced}>
        <div className="mt-2">
          <AdvancedSearchForm
            fields={fields}
            setFields={setFields}
            matchLogic={matchLogic}
            setMatchLogic={setMatchLogic}
          />
        </div>
      </Collapse>
    </div>
  );
}

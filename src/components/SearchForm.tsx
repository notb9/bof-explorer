import { InputGroup, Button, ListGroup } from "react-bootstrap";
import type { Bof } from "../types";
import React, { useMemo, useState, useRef, useEffect } from "react";
import { useDebounce } from "../hooks/useDebounce";
import "./SearchForm.css";

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

  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);

  const filtered = useMemo(() => {
    return allBofs.filter(
      (item) =>
        item.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(debouncedQuery.toLowerCase()),
    );
  }, [debouncedQuery, allBofs]);

  filtered.sort((a, b) => {
    const aMatch = a.name.toLowerCase() === query.toLowerCase();
    const bMatch = b.name.toLowerCase() === query.toLowerCase();

    if (aMatch && !bMatch) return -1;
    if (bMatch && !aMatch) return 1;

    return a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase());
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(() => e.target.value.toLowerCase());
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
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

    if (pos > 0 && pos <= filtered.length && e.key === "Enter") {
      e.preventDefault();
      setQuery("");
      setPlaceholder(filtered[pos - 1].name);
      onSelect(filtered[pos - 1]);
      setShow(false);
      e.currentTarget.blur();
    } else if (filtered.length === 1 && e.key === "Enter") {
      e.preventDefault();
      setQuery(() => "");
      setPlaceholder(filtered[0].name);
      onSelect(filtered[0]);
      setShow(false);
      e.currentTarget.blur();
    } else if (
      e.key === "Enter" &&
      filtered.length > 0 &&
      filtered[0].name.toLowerCase() === query.toLowerCase()
    ) {
      e.preventDefault();
      setQuery(() => "");
      setPlaceholder(filtered[0].name);
      onSelect(filtered[0]);
      setShow(false);
      e.currentTarget.blur();
    } else if (e.key === "Enter" && filtered.length > 0) {
      e.preventDefault();
      console.log("Enter");
      setPos(1);
      return;
    } else if (e.key === "Escape") {
      e.preventDefault();
      setShow(false);
    }

    setPos(0);
  };

  const handleClick = (bof: Bof) => {
    setQuery(() => "");
    setPlaceholder(bof.name);
    onSelect(bof);
  };

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
    <>
      <InputGroup className="bof-search">
        <div className="position-relative flex-grow-1">
          <input
            className="form-control w-100 bof-search-input"
            placeholder={placeholder}
            onChange={handleInput}
            onFocus={() => {
              setShow(true);
              setPlaceholder("Search for BOFs...");
            }}
            onBlur={() => setShow(false)}
            onKeyDown={handleKeyDown}
            value={query}
          />

          {show && filtered.length >= 1 && (
            <ListGroup className="position-absolute top-100 w-100 z-3 dropdown-container">
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

        <Button variant="primary" onClick={() => console.log("Go")}>
          &nbsp;Go&nbsp;&nbsp;
        </Button>
      </InputGroup>
    </>
  );
}

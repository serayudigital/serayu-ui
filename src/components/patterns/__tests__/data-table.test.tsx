// @vitest-environment happy-dom
import { describe, expect, it, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent, within } from "@testing-library/react";
import { DataTable, type Column } from "../data-table";

afterEach(() => cleanup());

interface Row {
  id: string;
  name: string;
  age: number;
}

const data: Row[] = [
  { id: "1", name: "Budi", age: 25 },
  { id: "2", name: "Ani", age: 30 },
  { id: "3", name: "Citra", age: 20 },
];

const columns: Column<Row>[] = [
  { key: "name", header: "Name" },
  {
    key: "age",
    header: "Age",
    sortable: true,
    sortAccessor: (r) => r.age,
  },
];

/** Get the desktop table (hidden md:block). */
function getDesktopTable(): HTMLTableElement {
  return document.querySelector("table") as HTMLTableElement;
}

/** Get all tbody rows (skip header row). */
function getBodyRows(): HTMLElement[] {
  const tbody = document.querySelector("tbody") as HTMLTableSectionElement;
  return Array.from(tbody.querySelectorAll("tr"));
}

describe("DataTable basics", () => {
  it("renders rows and headers (desktop)", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
      />
    );
    const table = getDesktopTable();
    expect(within(table).getByText("Name")).toBeDefined();
    expect(within(table).getByText("Age")).toBeDefined();
    expect(within(table).getByText("Budi")).toBeDefined();
  });

  it("shows emptyState when data is empty", () => {
    render(
      <DataTable
        columns={columns}
        data={[]}
        keyExtractor={(r) => r.id}
      />
    );
    expect(screen.getByText(/No data/i)).toBeDefined();
  });
});

describe("DataTable sort", () => {
  it("clicking sortable header toggles sort asc", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
      />
    );
    const table = getDesktopTable();
    const headerUmur = within(table).getByRole("button", { name: /Age/ });
    fireEvent.click(headerUmur);
    const rows = getBodyRows();
    expect(within(rows[0]).getByText("Citra")).toBeDefined();
    expect(within(rows[1]).getByText("Budi")).toBeDefined();
    expect(within(rows[2]).getByText("Ani")).toBeDefined();
  });

  it("clicking twice toggles desc", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
      />
    );
    const table = getDesktopTable();
    const headerUmur = within(table).getByRole("button", { name: /Age/ });
    fireEvent.click(headerUmur);
    fireEvent.click(headerUmur);
    const rows = getBodyRows();
    expect(within(rows[0]).getByText("Ani")).toBeDefined();
    expect(within(rows[2]).getByText("Citra")).toBeDefined();
  });

  it("clicking three times resets sort", () => {
    render(
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
      />
    );
    const table = getDesktopTable();
    const headerUmur = within(table).getByRole("button", { name: /Age/ });
    fireEvent.click(headerUmur);
    fireEvent.click(headerUmur);
    fireEvent.click(headerUmur);
    const rows = getBodyRows();
    // Original order: Budi, Ani, Citra.
    expect(within(rows[0]).getByText("Budi")).toBeDefined();
  });

  it("controlled sort via prop", () => {
    const onChange = vi.fn();
    render(
      <DataTable
        columns={columns}
        data={data}
        keyExtractor={(r) => r.id}
        sort={{ key: "age", direction: "desc" }}
        onSortChange={onChange}
      />
    );
    const rows = getBodyRows();
    expect(within(rows[0]).getByText("Ani")).toBeDefined();
    const table = getDesktopTable();
    const headerUmur = within(table).getByRole("button", { name: /Age/ });
    fireEvent.click(headerUmur);
    expect(onChange).toHaveBeenCalled();
  });
});

describe("DataTable pagination", () => {
  const manyRows: Row[] = Array.from({ length: 25 }, (_, i) => ({
    id: String(i + 1),
    name: `User ${i + 1}`,
    age: 20 + i,
  }));

  it("pageSize divides rows", () => {
    render(
      <DataTable
        columns={columns}
        data={manyRows}
        keyExtractor={(r) => r.id}
        pageSize={10}
      />
    );
    const rows = getBodyRows();
    expect(rows.length).toBe(10);
    // Page 1 = User 1 to User 10.
    expect(within(rows[0]).getByText("User 1")).toBeDefined();
    expect(within(rows[9]).getByText("User 10")).toBeDefined();
  });

  it("next button moves page", () => {
    render(
      <DataTable
        columns={columns}
        data={manyRows}
        keyExtractor={(r) => r.id}
        pageSize={10}
      />
    );
    fireEvent.click(screen.getByLabelText("Next page"));
    const rows = getBodyRows();
    expect(within(rows[0]).getByText("User 11")).toBeDefined();
    expect(within(rows[9]).getByText("User 20")).toBeDefined();
  });

  it("prev button disabled on page 1", () => {
    render(
      <DataTable
        columns={columns}
        data={manyRows}
        keyExtractor={(r) => r.id}
        pageSize={10}
      />
    );
    const prev = screen.getByLabelText("Previous page") as HTMLButtonElement;
    expect(prev.disabled).toBe(true);
  });

  it("controlled page via prop", () => {
    render(
      <DataTable
        columns={columns}
        data={manyRows}
        keyExtractor={(r) => r.id}
        pageSize={10}
        page={3}
        onPageChange={() => {}}
      />
    );
    const rows = getBodyRows();
    // Page 3: User 21 - User 25.
    expect(within(rows[0]).getByText("User 21")).toBeDefined();
    expect(within(rows[4]).getByText("User 25")).toBeDefined();
    expect(rows.length).toBe(5);
  });
});

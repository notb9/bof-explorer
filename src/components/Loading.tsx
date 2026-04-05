import { Spinner, Stack } from "react-bootstrap";

export function Loading() {
  return (
    <Stack gap={4} className="my-4">
      <center>
        <Spinner
          animation="border"
          role="status"
          style={{ width: "7rem", height: "7rem" }}
        ></Spinner>
      </center>
      <h3 className="text-center">Loading Kits...</h3>
    </Stack>
  );
}

"use client";
import useAlertStore from "@/stores/alertStore";
import { Button } from "@mui/material";

export default function Home() {
  const { alert, showAlert } = useAlertStore();
  return (
    <div className="">
            <Button
        disabled={Boolean(alert)}
        variant="outlined"
        onClick={() =>
          showAlert('Click the close icon to see the Collapse transition in action! Click the close icon to see the Collapse transition in action! Click the close icon to see the Collapse transition in action! Click the close icon to see the Collapse transition in action! Click the close icon to see the Collapse transition in action! Click the close icon to see the Collapse transition in action! Click the close icon to see the Collapse transition in action! Click the close icon to see the Collapse transition in action! Click the close icon to see the Collapse transition in action! Click the close icon to see the Collapse transition in action! Click the close icon to see the Collapse transition in action!', 'success')
        }
      >
        Re-open
      </Button>
    </div>
  );
}

import React from "react";

import Button from "components/Button";

interface Props {
  onSave: () => void;
}

function Actions({ onSave }: Props) {
  return (
    <div className="flex justify-end my-4">
      <Button variant="success" onClick={onSave}>
        Save
      </Button>
    </div>
  );
}

export default Actions;

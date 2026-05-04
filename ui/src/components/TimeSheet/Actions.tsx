import React, { useCallback, useState } from "react";

import Button from "components/Button";
import Spinner from "components/Spinner";

interface Props {
  onSave: () => Promise<void>;
}

function Actions({ onSave }: Props) {
  const [saving, setSaving] = useState(false);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      await onSave();
    } finally {
      setSaving(false);
    }
  }, [onSave]);

  return (
    <div className="flex justify-end my-4">
      <Button variant="success" onClick={handleSave} disabled={saving}>
        <span className="flex items-center">
          {saving && <Spinner />}
          {saving ? "Saving..." : "Save"}
        </span>
      </Button>
    </div>
  );
}

export default Actions;

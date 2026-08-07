import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";

import { useQueryClient } from "@tanstack/react-query";
import {
  retrieveTrackedTimeOptions,
  listTasksOptions,
} from "apiv3/@tanstack/react-query.gen";
import { TrackedTimeEditorPanel } from "components/tracking/TrackedTimeEditor";
import SlideOver from "components/SlideOver";

export const Route = createFileRoute("/tracking/$trackingId")({
  component: TrackedTimeDetailRoute,
  loader: async ({ params, context: { queryClient } }) => {
    const [trackedTime, tasksResponse] = await Promise.all([
      queryClient.fetchQuery(
        retrieveTrackedTimeOptions({ path: { id: params.trackingId } })
      ),
      queryClient.fetchQuery(listTasksOptions({ query: { state: "OPEN" } })),
    ]);

    return {
      trackedTime,
      tasks: tasksResponse.results,
    };
  },
});

function TrackedTimeDetailRoute() {
  const { trackedTime, tasks } = Route.useLoaderData();
  const { projects } = Route.useRouteContext();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: [{ _id: "listTrackedTimes" }] });
  };

  const handleClose = () => navigate({ to: "/tracking" });

  return (
    <SlideOver isOpen={Boolean(trackedTime)} onClose={handleClose}>
      <div className="px-2 sm:px-0">
        <div className="mb-4">
          <Link
            to="/tracking"
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to Tracked Time
          </Link>
        </div>
        <div className="bg-gray-100 p-4 rounded-md">
          <TrackedTimeEditorPanel
            trackedTime={trackedTime}
            projects={projects}
            tasks={tasks}
            onSaved={refresh}
            onClose={handleClose}
          />
        </div>
      </div>
    </SlideOver>
  );
}

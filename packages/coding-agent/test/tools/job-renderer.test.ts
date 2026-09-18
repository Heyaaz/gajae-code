import { describe, expect, it } from "bun:test";
import { getThemeByName } from "../../src/modes/theme/theme";
import { jobToolRenderer } from "../../src/tools/job";

describe("jobToolRenderer", () => {
	it("renders a paused job instead of failing the component render", async () => {
		const uiTheme = await getThemeByName("red-claw");
		expect(uiTheme).toBeDefined();

		// A folded background job is paused while it stays resumable, so the job
		// tool hands paused snapshots to this renderer.
		const result = {
			content: [{ type: "text", text: "" }],
			details: {
				jobs: [
					{
						id: "job-paused",
						type: "task",
						status: "paused",
						label: "paused subagent",
						durationMs: 1_000,
						foldReason: "steer",
					},
				],
			},
		};

		const component = jobToolRenderer.renderResult(result as never, { expanded: true, isPartial: false }, uiTheme!);
		const rendered = Bun.stripANSI(component.render(200).join("\n"));

		expect(rendered).toContain("job-paused");
		expect(rendered).toContain("paused subagent");
		expect(rendered).toContain("1 paused");
		expect(rendered).not.toContain("undefined");
	});

	it("renders a status this build does not know instead of throwing", async () => {
		const uiTheme = await getThemeByName("red-claw");
		expect(uiTheme).toBeDefined();

		// Tool details are read back from persisted sessions, so a snapshot can
		// carry a status that is not in this build's union.
		const result = {
			content: [{ type: "text", text: "" }],
			details: {
				jobs: [{ id: "job-foreign", type: "bash", status: "deferred", label: "foreign status", durationMs: 5 }],
			},
		};

		const component = jobToolRenderer.renderResult(result as never, { expanded: false, isPartial: false }, uiTheme!);
		const rendered = Bun.stripANSI(component.render(200).join("\n"));

		expect(rendered).toContain("job-foreign");
		expect(rendered).not.toContain("undefined");
	});
});

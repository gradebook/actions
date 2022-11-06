// This file contains a very small subset of allowed actions.
type WorkflowTrigger = Record<string, unknown>;

type WorkflowCallJob = {
	uses: string;
	with?: Record<string, string>;
};

type WorkflowJobStep = {
	name?: string;
	env?: Record<string, string>;
} & (
	{run: string; uses: never} | {uses: string; run: never}
);

type InlineJob = {
	'runs-on': string;
	concurrency?: {
		group: string;
		'cancel-in-progress'?: boolean;
	};
	needs?: string[];
	environment?: string | {
		name: string;
		url?: string;
	};
	'timeout-minutes'?: number;
	steps: WorkflowJobStep[];
};

type WorkflowJob = WorkflowCallJob | InlineJob;

export type Action = {
	name?: string;
	on: Partial<WorkflowTrigger>;
	jobs: Record<string, WorkflowJob>;
};

export type LintError = {
	fileName: string;
	repository: string;
	remoteFileName: string;
	ruleName: string;
	error: string;
};

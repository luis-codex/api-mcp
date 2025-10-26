export const formatToolResponse = (opts: {
  json?: any;
  error?: unknown;
  action?: string;
}): any => {
  if (
    opts &&
    Object.prototype.hasOwnProperty.call(opts, "error") &&
    opts.error !== undefined
  ) {
    return {
      content: [
        {
          type: "text",
          text: `Error ${opts.action ?? "processing"}: ${String(opts.error)}`,
        },
      ],
    };
  }

  return {
    content: [
      {
        type: "text",
        text: `RESPONSE API: ${JSON.stringify(opts.json)}`,
      },
    ],
  };
};

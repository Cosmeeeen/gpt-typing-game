module.exports = {
  // eslint-disable-next-line @typescript-eslint/require-await
  async rewrites() {
    return [
      {
        source: "/api/loglib",
        destination: "https://loglib.io/api/loglib",
      },
    ];
  },
};

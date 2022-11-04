const english = {
  // Permissions
  NEED_VIP: "❌ Only VIP users or servers can use this feature.",

  // Execute Command
  EXECUTE_COMMAND_NOT_FOUND: "❌ Something went wrong. I was not able to find this command.",
  EXECUTE_COMMAND_ERROR: "❌ Something went wrong. The command execution has thrown an error.",

  // Language Command
  LANGUAGE_NAME: "language",
  LANGUAGE_DESCRIPTION: "⚙️ Change the bots language.",
  LANGUAGE_KEY_NAME: "name",
  LANGUAGE_KEY_DESCRIPTION: "What language would you like to set?",
  LANGUAGE_UPDATED: (language: string) => `The language has been updated to ${language}`,

  // Ping Command
  PING_NAME: "ping",
  PING_DESCRIPTION: "🏓 Check whether the bot is online and responsive.",
  PING_RESPONSE: "🏓 Pong! I am online and responsive! :clock10:",
  PING_RESPONSE_WITH_TIME: (time: number) => `🏓 Pong! ${time / 1000} seconds! I am online and responsive! :clock10:`,

  // Work Command
  WORK_NAME: "work",
  WORK_DESCRIPTION: "💼 Work for some extra cash!",
  WORK_NO_CHANNEL: "You can't work in DM's weirdo!",

  // Open Command
  OPEN_NAME: "open",
  OPEN_DESCRIPTION: "Open any personal gifts you've recieved!",
  OPEN_KEY_NAME: 'box',
  OPEN_KEY_DESCRIPTION: "What box would you like to open up?",
} as const;

export default english;

import chalk from "chalk";

export default function Logger(message: string, type: "INFO" | "ERR" | "WARN" = "INFO", category?: "DB" | "AUTH" | "API" | "SERVER") {
    if (process.env.NODE_ENV === "development") {
        return;
    }
    const date = new Date();
    const formattedDate = `${date.toISOString().split("T")[0]} ${date
        .toTimeString()
        .split(" ")[0]}`;
    let type_msg = '';
    if (type === "INFO") {
        type_msg = chalk.blue(`[${type}${category ? `-${category}` : ''}]`);
    } else if (type === "ERR") {
        type_msg = chalk.red(`[${type}${category ? `-${category}` : ''}]`);
    } else if (type === "WARN") {
        type_msg = chalk.yellow(`[${type}${category ? `-${category}` : ''}]`);
    }

    const logMessage = `${type_msg} ${formattedDate} | ${message}`;
    console.log(logMessage + "\n");
}
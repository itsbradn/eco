export function msToTime(ms: number) {
	let seconds = parseInt((ms / 1000).toFixed(1));
	let minutes = parseInt((ms / (1000 * 60)).toFixed(1));
	let hours = parseInt((ms / (1000 * 60 * 60)).toFixed(1));
	let days = parseInt((ms / (1000 * 60 * 60 * 24)).toFixed(1));
	if (seconds < 60) return seconds + " seconds";
	else if (minutes < 60) return minutes + " minutes";
	else if (hours < 24) return hours + " hours";
	else return days + " days"
  }
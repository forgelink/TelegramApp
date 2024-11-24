import type { InlineKeyboardButton, InlineKeyboardMarkup, Message } from '@grammyjs/types';

class Telegram {
	apiToken: string;
	secretToken: string;

	textHandlers: { [key: string]: (msg: Message) => Promise<void> };
	arrRegexHandlers: Array<{ pattern: RegExp; handler: (msg: Message) => Promise<void> }>;
	anyTextHandler: ((msg: Message) => Promise<void>) | null;
	buttonHandlers: { [key: string]: (callbackQuery: any) => Promise<void> };
	anyButtonHandler: ((callbackQuery: any) => Promise<void>) | null;

	constructor(apiToken: string, secretToken: string) {
		this.apiToken = apiToken;
		this.secretToken = secretToken;

		this.textHandlers = {};
		this.arrRegexHandlers = [];
		this.anyTextHandler = null;
		this.buttonHandlers = {};
		this.anyButtonHandler = null;
	}

	async handlerRequest(reqBody: any) {
		if (reqBody.message) {
			await this.textMessageHandler(reqBody.message as Message);
		}
		if (reqBody.callback_query) {
			// this.inlineMarkupHandler(reqBody.callback_query);
		}
	}

	async textMessageHandler(receivedMsg: Message) {
		const msg = receivedMsg.text;
		if (!msg) {
			return;
		}

		const textHandler = this.textHandlers[msg];
		if (textHandler) {
			await textHandler(receivedMsg);
			return;
		}

		const foundMatch = await this.arrRegexHandlers.reduce(async (matchFound, re) => {
			// Wait for previous iterations
			const matched = await matchFound;
			if (matched) return true;

			const isMatch = msg.match(re.pattern);
			if (isMatch) {
				await re.handler(receivedMsg);
				return true;
			}
			return false;
		}, Promise.resolve(false));

		// Only run anyTextHandler if no matches were found
		if (!foundMatch && this.anyTextHandler) {
			await this.anyTextHandler(receivedMsg);
		}
	}

	// inlineMarkupHandler(callbackQuery) {
	// 	const buttonData = callbackQuery.data;
	// 	if (!buttonData) {
	// 		return;
	// 	}
	// 	const buttonHandler = this.buttonHandlers[buttonData];
	// 	if (buttonHandler) {
	// 		buttonHandler(callbackQuery);
	// 		return;
	// 	}
	// 	// Similar to the text message handler, this should be the final step to validate that no matches occurred
	// 	if (this.anyButtonHandler) {
	// 		this.anyButtonHandler(callbackQuery);
	// 	}
	// }

	onTextMessage(message: string | RegExp, handler: (msg: Message) => Promise<void>) {
		if (typeof message === 'string') {
			if (message === '') {
				this.anyTextHandler = handler;
			} else {
				this.textHandlers[message] = handler;
			}
		} else if (message instanceof RegExp) {
			this.arrRegexHandlers.push({
				pattern: message,
				handler,
			});
		}
	}

	onButton(buttonDataTrigger: string, handler: (callbackQuery: any) => Promise<void>) {
		if (typeof buttonDataTrigger !== 'string') {
			return;
		}
		if (buttonDataTrigger === '') {
			this.anyButtonHandler = handler;
		} else {
			this.buttonHandlers[buttonDataTrigger] = handler;
		}
	}

	/**
	 * Makes a request to the Telegram Bot API.
	 * @param endpoint - The API endpoint (e.g., `sendMessage`).
	 * @param method - The HTTP method to use (default: 'POST').
	 * @param body - The body of the request (optional).
	 */
	async request(endpoint: string, method: string = 'POST', body?: object) {
		const url = `https://api.telegram.org/bot${this.apiToken}/${endpoint}`;

		const headers: HeadersInit = {
			'Content-Type': 'application/json',
		};

		const options: RequestInit = {
			method,
			headers,
		};

		if (body) {
			options.body = JSON.stringify(body);
		}

		const response = await fetch(url, options);

		if (!response.ok) {
			throw new Error(`Telegram API request failed with status ${response.status}: ${await response.text()}`);
		}

		return response.json();
	}

	/**
	 * Retrieves information about the currently set webhook.
	 */
	async getWebhookInfo() {
		return this.request('getWebhookInfo', 'GET');
	}

	/**
	 * Registers a webhook for Telegram updates.
	 * @param webhookUrl - The URL of your webhook (e.g., your Cloudflare Worker URL).
	 */
	async setWebhook(webhookUrl: string) {
		return this.request('setWebhook', 'POST', {
			url: webhookUrl,
			secret_token: this.secretToken, // Optional: Validates incoming updates
		});
	}

	/**
	 * Example: Send a message using the Telegram Bot API.
	 * @param chatId - The ID of the chat to send the message to.
	 * @param text - The message text to send.
	 */
	async sendMessage(chatId: string | number, text: string) {
		return this.request('sendMessage', 'POST', {
			chat_id: chatId,
			text,
		});
	}

	async sendInlineKeyboard(chatId: string | number, text: string, inlineKeyboard: InlineKeyboardButton[][]) {
		return this.request('sendMessage', 'POST', {
			chat_id: chatId,
			text,
			reply_markup: {
				inline_keyboard: inlineKeyboard,
			},
		});
	}
}

export default Telegram;

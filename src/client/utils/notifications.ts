import { writable } from 'svelte/store';

export interface NotificationProps {
	title?: string;
	text?: string;
	err?: boolean;
}

export interface NotificationOptions {
	ttl?: number | null;
	place?: number | null;
}

export interface UpdateHandleOptions {
	resetTTL?: boolean;
}

export const store = writable<NotificationProps[]>([]);

export const notifications = {
	create: (options: NotificationProps & NotificationOptions = {}) => {
		const { title, text, err, ttl, place }: NotificationProps & NotificationOptions = {
			title: '',
			text: '',
			err: false,
			ttl: null,
			place: null,
			...options
		};

		const notification: NotificationProps = { title, text, err };

		store.update((notifications) =>
			place === null ? [...notifications, notification] : [...notifications.slice(0, place), notification, ...notifications.slice(place + 1)]
		);

		let timeout =
			ttl === null
				? null
				: setTimeout(() => {
						store.update((notifications) => notifications.filter((n) => n !== notification));
				  }, ttl * 1000);

		return {
			remove: () => {
				if (timeout !== null) {
					clearTimeout(timeout);
				}

				store.update((notifications) => notifications.filter((n) => n !== notification));
			},
			update: (options: NotificationProps & UpdateHandleOptions = {}) => {
				const { title, text, err, resetTTL }: NotificationProps & UpdateHandleOptions = {
					resetTTL: true,
					...options
				};

				if (resetTTL) {
					const newNotification = { title, text, err };

					store.update((notifications) =>
						notifications.map((n) => {
							if (n === notification) {
								newNotification.title ??= n.title;
								newNotification.text ??= n.text;
								newNotification.err ??= n.err;

								return newNotification;
							} else {
								return n;
							}
						})
					);

					if (ttl !== null) {
						timeout = setTimeout(() => {
							store.update((notifications) => notifications.filter((n) => n !== notification));
						}, ttl * 1000);
					}
				} else {
					store.update((notifications) =>
						notifications.map((n) =>
							n === notification
								? {
										title: title !== undefined ? title : n.title,
										text: text !== undefined ? text : n.text,
										err: err !== undefined ? err : n.err
								  }
								: n
						)
					);
				}
			}
		};
	}
};


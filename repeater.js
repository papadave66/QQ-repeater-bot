/*
# Copyright 2015-2021 papadave66
#
# Permission is hereby granted, free of charge, to any person obtaining
# a copy of this software and associated documentation files (the
# "Software"), to deal in the Software without restriction, including
# without limitation the rights to use, copy, modify, merge, publish,
# distribute, sublicense, and/or sell copies of the Software, and to
# permit persons to whom the Software is furnished to do so, subject to
# the following conditions:
#
# The above copyright notice and this permission notice shall be included
# in all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
# EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
# MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
# IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
# CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
# TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
# SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
const { Bot, Message, Middleware } = require('mirai-js');
//CONFIGURE HERE
const repeat_after_times = 1; // the bot will repeat member's message after this time.
const random_number_max = 35; // repeat when random number is 0. range from 0 to random_opportunity
(async () => {
	try {
		// EDIT THE FOLLOWING CONFIGURE TOO.
		const baseUrl = 'http://localhost:8080';
		const authKey = 'admin';
		const qq = 114514;
		const password = '114514';
		const bot = new Bot();

		// create a session
		await bot.open({
			baseUrl,
			qq,
			authKey,
		});

		var old_message;
		let counter = 0;
		bot.on('GroupMessage', new Middleware()
			.textProcessor().done(({
				text,
				sender: {
					group: {
						id: fromGroup,
					}
				}
			}) => {
				if(text == old_message){
					counter++;
				}else{
					old_message = text;
					counter = 0;
				}
				if(counter == repeat_after_times){
					bot.sendMessage({
						group: fromGroup,
						message: new Message().addText(text),
					});
				}
			}));

// the following function which the bot can agree with others. :p
		bot.on('GroupMessage', async data => {
			let random_num = Math.floor(Math.random() * random_number_max);
//			console.log("the random number is "+random_num);
			if(random_num == 0) {
				console.log("the message have been repeated");
				await bot.sendMessage({
					group: data.sender.group.id,
					message: new Message().addText("u1s1，确实"),
				});
			}
		});

		bot.on('BotOfflineEventForce',
			new Middleware()
				.autoReLogin({ bot, baseUrl, authKey, password })
				.done()
		);
	} catch (err) {
		console.log(err);
	}
})();

import { environment } from './../environments/environment.prod';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import io from "socket.io-client";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    socket;

    messages: { id: string, sender: string, message: string }[] = [];

    @ViewChild("input", { static: false }) input: ElementRef;
    @ViewChild("name", { static: false }) nameInput: ElementRef;
    name: string = "";

    constructor() { }

    ngOnInit() {
        this.setupSocket();
        this.getChatHistory();
        this.messageObserv();
    }

    setupSocket(): void {
        this.socket = io(environment.SOCKET_URL, { transports: ['websocket'] });
    }

    getChatHistory(): void {
        this.socket.on("chat_history", (message) => {
            this.messages.push(message);
        });
    }

    messageObserv(): void {
        this.socket.on("get_message", (message) => {
            this.messages.push(message);
        })
    }

    login(event): void {
        event.preventDefault();
        this.name = this.nameInput.nativeElement.value;
    }

    sendMessage(event): void {
        event.preventDefault();
        if (this.input.nativeElement.value != "") {
            this.socket.emit("send_message", { sender: this.name, message: this.input.nativeElement.value });
            this.input.nativeElement.value = "";
        }
    }
}

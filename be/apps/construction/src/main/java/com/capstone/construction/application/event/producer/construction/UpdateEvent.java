package com.capstone.construction.application.event.producer.construction;

public class UpdateEvent extends BaseEvent {
    public UpdateEvent(String formCode, String formNumber, String constructionCaptain) {
        super(formCode, formNumber, constructionCaptain);
    }
}

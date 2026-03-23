package com.capstone.data.repository;

import com.capstone.data.source.remote.NotificationApi;
import com.capstone.data.source.response.NotificationResponse;
import com.capstone.data.source.response.WrapperApiResponse;
import com.capstone.domain.model.Notification;
import com.capstone.domain.repository.NotificationRepository;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Response;

public class NotificationRepositoryImpl implements NotificationRepository {
    private final NotificationApi api;

    public NotificationRepositoryImpl(NotificationApi api) {
        this.api = api;
    }

    @Override
    public List<Notification> getNotifications(int page, int size) throws Exception {
        Response<WrapperApiResponse<List<NotificationResponse>>> response = api.getNotifications(page, size).execute();

        if (response.isSuccessful() && response.body() != null) {
            List<NotificationResponse> list = response.body().getData();
            List<Notification> domainList = new ArrayList<>();
            for (var item : list) {
                domainList.add(new Notification(
                        item.getNotificationId(),
                        item.getLink(),
                        item.getMessage(),
                        item.getStatus(),
                        item.getCreatedAt()
                ));
            }
            return domainList;
        }

        return new ArrayList<>();
    }

    @Override
    public boolean markAsRead(String notificationId) throws Exception {
        Response<WrapperApiResponse<Void>> response = api.markAsRead(notificationId).execute();
        return response.isSuccessful() && response.body() != null && response.body().getStatus() == 200;
    }
}

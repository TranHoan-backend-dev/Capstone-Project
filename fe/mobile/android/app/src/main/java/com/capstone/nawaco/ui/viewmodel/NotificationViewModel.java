package com.capstone.nawaco.ui.viewmodel;

import androidx.lifecycle.LiveData;
import androidx.lifecycle.MutableLiveData;
import androidx.lifecycle.ViewModel;

import com.capstone.nawaco.domain.model.Notification;
import com.capstone.nawaco.domain.repository.NotificationRepository;

import dagger.hilt.android.lifecycle.HiltViewModel;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

import javax.inject.Inject;

@HiltViewModel
public class NotificationViewModel extends ViewModel {
    private final NotificationRepository notificationRepository;
    private final ExecutorService executor = Executors.newSingleThreadExecutor();

    private final MutableLiveData<List<Notification>> notifications = new MutableLiveData<>(new ArrayList<>());
    private final MutableLiveData<Boolean> isLoading = new MutableLiveData<>(false);
    private final MutableLiveData<String> error = new MutableLiveData<>(null);

    @Inject
    public NotificationViewModel(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public LiveData<List<Notification>> getNotifications() {
        return notifications;
    }

    public LiveData<Boolean> getIsLoading() {
        return isLoading;
    }

    public LiveData<String> getError() {
        return error;
    }

    public void fetchNotifications(int page, int size) {
        isLoading.setValue(true);
        executor.execute(() -> {
            try {
                List<Notification> newNotifications = notificationRepository.getNotifications(page, size);
                List<Notification> currentList = new ArrayList<>(Objects.requireNonNull(notifications.getValue()));
                if (page == 0) {
                    notifications.postValue(newNotifications);
                } else {
                    currentList.addAll(newNotifications);
                    notifications.postValue(currentList);
                }
                error.postValue(null);
            } catch (Exception e) {
                error.postValue(e.getMessage());
            } finally {
                isLoading.postValue(false);
            }
        });
    }

    public void markAsRead(String id) {
        executor.execute(() -> {
            try {
                var success = notificationRepository.markAsRead(id);
                if (success) {
                    List<Notification> currentList = new ArrayList<>(Objects.requireNonNull(notifications.getValue()));
                    for (var i = 0; i < currentList.size(); i++) {
                        var n = currentList.get(i);
                        if (n.getId().equals(id)) {
                            currentList.set(i, n.copyWithRead(true));
                            break;
                        }
                    }
                    notifications.postValue(currentList);
                }
            } catch (Exception e) {
                error.postValue(e.getMessage());
            }
        });
    }

    @Override
    protected void onCleared() {
        super.onCleared();
        executor.shutdown();
    }
}

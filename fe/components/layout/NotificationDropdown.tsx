"use client";

import React, { useState } from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem,
    Badge,
    Avatar,
    ScrollShadow,
    Button
} from "@heroui/react";
import { BellIcon, CheckCircleIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

interface Notification {
    id: string;
    sender: string;
    message: string;
    time: string;
    isRead: boolean;
    avatar: string;
    type: 'message' | 'system' | 'billing';
}

const NotificationDropdown = () => {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: '1',
            sender: 'Hệ thống',
            message: 'Đơn hàng 01025120007 của bạn đã được thanh toán thành công.',
            time: '2 phút trước',
            isRead: false,
            avatar: '',
            type: 'system'
        },
        {
            id: '2',
            sender: 'Trần Thị Nguyệt',
            message: 'Đã gửi một yêu cầu khảo sát thiết kế mới.',
            time: '1 giờ trước',
            isRead: false,
            avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
            type: 'message'
        },
        {
            id: '3',
            sender: 'Phòng Kế toán',
            message: 'Thông báo chốt số nước tháng 12/2025.',
            time: '3 giờ trước',
            isRead: true,
            avatar: '',
            type: 'billing'
        },
        {
            id: '4',
            sender: 'Nguyễn Văn Vũ',
            message: 'Bạn có một tin nhắn mới về bản vẽ thiết kế.',
            time: 'Hôm qua',
            isRead: true,
            avatar: 'https://i.pravatar.cc/150?u=a04258114e29026302d',
            type: 'message'
        },
        {
            id: '5',
            sender: 'Hệ thống',
            message: 'Bảo trì hệ thống vào lúc 00:00 ngày 30/12/2025.',
            time: '2 ngày trước',
            isRead: true,
            avatar: '',
            type: 'system'
        },
        {
            id: '6',
            sender: 'Hoàng Thế Quý',
            message: 'Yêu cầu hỗ trợ thay đổi địa chỉ lắp đặt.',
            time: '3 ngày trước',
            isRead: true,
            avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
            type: 'message'
        },
    ]);

    const [filter, setFilter] = useState<'all' | 'unread'>('all');
    const [isLoading, setIsLoading] = useState(false);

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => !n.isRead);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    const handleScroll = (e: React.UIEvent<HTMLElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        if (scrollHeight - scrollTop <= clientHeight + 10 && !isLoading && filter === 'all') {
            setIsLoading(true);
            setTimeout(() => {
                const newBatch: Notification[] = [
                    {
                        id: Math.random().toString(),
                        sender: 'Hệ thống',
                        message: 'Thông báo lịch sử về hoạt động trước đây đã được lưu trữ.',
                        time: '1 tuần trước',
                        isRead: true,
                        avatar: '',
                        type: 'system'
                    }
                ];
                setNotifications(prev => [...prev, ...newBatch]);
                setIsLoading(false);
            }, 800);
        }
    };

    return (
        <Dropdown placement="bottom-end" className="p-0">
            <DropdownTrigger>
                <div className="relative p-2 cursor-pointer rounded-full hover:bg-gray-100 transition-colors">
                    <Badge
                        content={unreadCount > 0 ? unreadCount : null}
                        color="danger"
                        shape="circle"
                        size="sm"
                        className={unreadCount === 0 ? "hidden" : "border-2 border-white"}
                    >
                        <BellIcon className="w-6 h-6 text-gray-600" />
                    </Badge>
                </div>
            </DropdownTrigger>
            <DropdownMenu
                aria-label="Notifications"
                className="w-[360px] md:w-[400px] p-0 overflow-visible rounded-2xl shadow-2xl border border-gray-100 bg-white"
                variant="light"
            >
                <DropdownSection
                    aria-label="Header"
                    classNames={{
                        base: "w-full p-0 flex flex-col",
                        group: "p-0"
                    }}
                >
                    <DropdownItem key="header" isReadOnly className="p-0 opacity-100 cursor-default focus:bg-transparent">
                        <div className="flex flex-col gap-4 px-4 pt-4 pb-2 border-b border-gray-50 bg-white rounded-t-2xl pointer-events-auto">
                            <div className="flex justify-between items-center">
                                <span className="text-2xl font-black text-gray-900 tracking-tight">Thông báo</span>
                                <Button isIconOnly variant="light" size="sm" radius="full" className="hover:bg-gray-100">
                                    <EllipsisHorizontalIcon className="w-6 h-6 text-gray-600" />
                                </Button>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    size="sm"
                                    radius="full"
                                    className={`font-bold px-4 ${filter === 'all' ? 'bg-blue-50 text-blue-600' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
                                    onClick={(e) => { e.stopPropagation(); setFilter('all'); }}
                                >
                                    Tất cả
                                </Button>
                                <Button
                                    size="sm"
                                    radius="full"
                                    className={`font-bold px-4 ${filter === 'unread' ? 'bg-blue-50 text-blue-600' : 'bg-transparent text-gray-600 hover:bg-gray-100'}`}
                                    onClick={(e) => { e.stopPropagation(); setFilter('unread'); }}
                                >
                                    Chưa đọc
                                </Button>
                            </div>
                        </div>
                    </DropdownItem>
                </DropdownSection>

                <DropdownSection
                    aria-label="Notification list"
                    classNames={{
                        base: "w-full p-0 flex flex-col",
                        group: "p-0"
                    }}
                >
                    <DropdownItem key="scroll-container" textValue="Notifications list" className="p-0 hover:bg-transparent cursor-default focus:bg-transparent">
                        <ScrollShadow
                            className="max-h-[520px] w-full"
                            onScroll={handleScroll}
                            hideScrollBar
                        >
                            <div className="flex flex-col py-2 px-2">
                                {filteredNotifications.map((n) => (
                                    <div
                                        key={n.id}
                                        className={`flex items-center gap-3 px-3 py-3 cursor-pointer transition-all rounded-xl relative group hover:bg-gray-50/80 mb-1`}
                                    >
                                        <div className="relative shrink-0">
                                            <Avatar
                                                src={n.avatar}
                                                name={n.sender}
                                                size="lg"
                                                className={!n.avatar ? "bg-blue-100 text-blue-600 font-bold" : "border border-gray-100"}
                                            />
                                            <div className={`absolute -bottom-1 -right-1 rounded-full p-1 border-2 border-white ${n.type === 'system' ? 'bg-blue-600' : n.type === 'billing' ? 'bg-green-600' : 'bg-orange-600'}`}>
                                                {n.type === 'message' ? (
                                                    <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                                                ) : (
                                                    <CheckCircleIcon className="w-2.5 h-2.5 text-white" />
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 pr-4">
                                            <p className={`text-[14px] leading-[1.3] ${!n.isRead ? 'font-bold text-gray-900' : 'text-gray-600 font-medium'}`}>
                                                <span className="text-gray-900">{n.sender}</span> {n.message}
                                            </p>
                                            <p className={`text-[12px] mt-1 ${!n.isRead ? 'text-blue-600 font-bold' : 'text-gray-400 font-medium'}`}>
                                                {n.time}
                                            </p>
                                        </div>
                                        {!n.isRead && (
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                                                <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                                {filteredNotifications.length === 0 && (
                                    <div className="py-20 text-center text-gray-400 px-4">
                                        <BellIcon className="w-12 h-12 mx-auto opacity-20 mb-3" />
                                        <p className="font-bold text-gray-500">Không có thông báo mới</p>
                                        <p className="text-sm">Khi có bình luận hoặc tin nhắn, bạn sẽ thấy ở đây.</p>
                                    </div>
                                )}
                                {isLoading && (
                                    <div className="p-6 text-center">
                                        <div className="inline-block w-6 h-6 border-[3px] border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                                    </div>
                                )}
                            </div>
                        </ScrollShadow>
                    </DropdownItem>
                </DropdownSection>

                <DropdownSection
                    aria-label="Footer"
                    classNames={{
                        base: "p-2 border-t border-gray-50 bg-white rounded-b-2xl",
                        group: "p-0"
                    }}
                >
                    <DropdownItem key="view-all" className="p-0 text-center text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 rounded-xl transition-colors">
                        <span className="block py-2.5">Xem tất cả</span>
                    </DropdownItem>
                </DropdownSection>
            </DropdownMenu>
        </Dropdown>
    );
};

export default NotificationDropdown;

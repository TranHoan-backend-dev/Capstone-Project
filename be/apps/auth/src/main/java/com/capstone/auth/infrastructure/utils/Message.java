package com.capstone.auth.infrastructure.utils;

public final class Message {
  // for dto and entity layer
  public static final String PT_02 = "Mật khẩu không hợp lệ. Mật khẩu phải chứa ít nhất một chữ số, một chữ hoa, một chữ thường, một ký tự đặc biệt và có độ dài ít nhất 8 ký tự";
  public static final String PT_04 = "Đối tượng này không được để trống";
  public static final String PT_05 = "Tên đăng nhập không được để trống";
  public static final String PT_06 = "Đối tượng Role không được để trống";
  public static final String PT_07 = "Tên vai trò (Nhân viên IT, Nhân viên phòng Kế hoạch-Kỹ thuât,...) không được để trống";
  public static final String PT_08 = "Đối tượng Role phải có ít nhất một người dùng";
  public static final String PT_09 = "Profile phải có một người dùng";
  public static final String PT_10 = "Họ và tên không được để trống";
  public static final String PT_11 = "Ảnh đại diện không được để trống";
  public static final String PT_13 = "Họ và tên không được chứa chữ số và ký tự đặc biệt";
  public static final String PT_16 = "Giới tính không được để trống";
  public static final String PT_17 = "Ngày sinh không được để trống";
  public static final String PT_18 = "Id của chi nhánh cấp nước không được để trống";
  public static final String PT_19 = "Id của phòng ban không được để trống";
  public static final String PT_20 = "Id của công việc không được để trống";
  public static final String PT_23 = "Id của vai trò không được để trống";
  public static final String PT_24 = "URL chữ ký điện tử không được để trống";
  public static final String PT_25 = "Định dạng ngày sinh không chính xác. Phải đảm bảo định dạng là yyyy-MM-dd";

  // for service layer
  public static final String SE_01 = "Email đã tồn tại";
  public static final String SE_02 = "Không tìm thấy Email";
  public static final String SE_03 = "";
  public static final String SE_04 = "Người dùng không tồn tại";
  public static final String SE_05 = "Thông tin xác thực này không tồn tại";
  public static final String SE_06 = "Hồ sơ của tài khoản này chưa được khởi tạo";
  public static final String SE_07 = "Người dùng đã bị khóa";
  public static final String SE_08 = "Không tìm thấy vai trò";
  public static final String SE_09 = "Số điện thoại đã tồn tại";
  public static final String SE_10 = "Chi nhánh cấp nước không tồn tại";
  public static final String SE_11 = "Phòng ban không tồn tại";
}

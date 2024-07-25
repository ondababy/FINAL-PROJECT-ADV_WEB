<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
<link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
<link rel="stylesheet" href="{{ asset('css/sidebar.css') }}">
{{-- <link rel="stylesheet" href="{{ asset('css/darkmode.css') }}"> --}}
<nav id="mySidebar" class="sidebar">
    <header>
        <div class="image-text">
            <span class="image">
                <img src="{{ Auth::user()->image ? asset(Auth::user()->image) : asset('photo/logo.png') }}" alt="Profile Image" style="width: 80px; height: 80px; border-radius: 50%;">
            <div class="header-text">
                <span class="name text-center">{{ Auth::user()->name }}</span>
            </div>
        </div>
    </header>
    <div class="menu-bar">
        <div class="menu">
            <li class="search-box">
                <i class='bx bx-search-alt-2 icon'></i>
                <input type="text" placeholder="Search...">
            </li>
            <ul class="menu-links">
                <li class="nav-link">
                    <a href="{{ route('admin.dashboard') }}"><i class='bx bx-home icon'></i>
                        <span class="text nav-text">Home</span>
                    </a>
                </li>
                <li class="nav-link">
                    <a href="{{ route('admin.profile') }}"><i class='bx bx-user icon'></i>
                        <span class="text nav-text">Profile</span>
                    </a>
                </li>
                <li class="nav-link">
                    <a href="/brands"><i class='bx bxs-purchase-tag icon'></i>
                        <span class="text nav-text">Brands</span>
                    </a>
                </li>
                <li class="nav-link">
                    <a href="/suppliers"><i class='bx bx-store icon'></i>
                        <span class="text nav-text">Suppliers</span>
                    </a>
                </li>
                <li class="nav-link">
                    <a href="/couriers"><i class='bx bxs-truck icon'></i>
                        <span class="text nav-text">Couriers</span>
                    </a>
                </li>
                <li class="nav-link">
                    <a href="/products"><i class='bx bx-box icon'></i>
                        <span class="text nav-text">Products</span>
                    </a>
                </li>
                <li class="nav-link">
                    <a href="{{ route('admin.orders') }}"><i class='bx bx-receipt icon'></i>
                        <span class="text nav-text">Orders</span>
                    </a>
                </li>
                <li class="nav-link">
                    <a href="{{ route('admin.stocks') }}"><i class='bx bx-store icon'></i>
                        <span class="text nav-text">Inventory</span>
                    </a>
                </li>
                <li class="nav-link">
                    <a href="{{ route('admin.users') }}"><i class='bx bx-user icon'></i>
                        <span class="text nav-text">Users</span>
                    </a>
                </li>
                <li class="nav-link">
                    <a href="{{ route('admin.charts') }}"><i class='bx bx-bar-chart-alt-2 icon'></i>
                        <span class="text nav-text">Charts</span>
                    </a>
                </li>
                <li class="nav-link">
                    <a href="#"><i class='bx bx-question-mark icon'></i>
                        <span class="text nav-text">FAQS</span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="bottom-content">
            <li class="">
                <a href="#">
                    <i class='bx bx-log-out icon'></i>
                    <span class="text nav-text" id="logoutButton">Logout</span>
                </a>
            </li>
            <li class="mode">
                <div class="moon-sun">
                    <i class='bx bx-moon icon moon'></i>
                    <i class='bx bx-sun icon sun'></i>
                </div>
                <span class="mode-text text">Dark mode</span>
                <div class="toggle-switch">
                    <span class="switch"></span>
                </div>
            </li>
        </div>
    </div>
</nav>
<div id="main">
</div>

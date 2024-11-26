import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule, MatSelectionList } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { debounceTime, distinctUntilChanged } from 'rxjs';



@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSortHeader,
    MatSortModule,
    MatIconModule,
    MatMenuModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatSelectionList,
    MatListModule,
    MatDatepickerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit, AfterViewInit {
  @ViewChild('usersPaginator') usersPaginator!: MatPaginator;
  @ViewChild('ordersPaginator') ordersPaginator!: MatPaginator;
  @ViewChild('supplierPaginator') supplierPaginator!: MatPaginator;
  @ViewChild('agentPaginator') agentPaginator!: MatPaginator;
  @ViewChild('productPaginator') productPaginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  selectedTabIndex: number = 0;
  searchQuery: string = '';
  searchControl = new FormControl();

  userDataSource = new MatTableDataSource<UserData>(ELEMENT_DATA);
  orderDataSource = new MatTableDataSource<OrderData>(ELEMENT_DATA2);
  supplierDataSource = new MatTableDataSource<SupplierData>(ELEMENT_DATA3);
  agentDataSource = new MatTableDataSource<AgentData>(ELEMENT_DATA4);
  productDataSource = new MatTableDataSource<ProductData>(ELEMENT_DATA5);

  orderPlacedForm!: FormGroup;
  supplierForm!: FormGroup;
  dateForm!: FormGroup;
  isContainerVisible: boolean = false;


  displayedUserColumns: string[] = ['id', 'name', 'phone', 'email', 'registrationDate', 'totalOrders'];
  displayedOrderColumns: string[] = ['id', 'username', 'supplier', 'user', 'email', 'createdOn', 'products', 'status'];
  displayedSupplierColumns: string[] = ['id', 'name', 'email', 'registered', 'orders', 'delivered', 'revenue', 'commission'];
  displayedAgentColumns: string[] = ['id', 'name', 'email', 'supplier', 'totalOrders', 'delivered', 'revenue'];
  displayedProductColumns: string[] = ['productName', 'categoryName', 'averageCostPrice', 'averageSellingPrice', 'sellingPriceRange', 'profit', 'numberOfSuppliers', 'totalCurrentSupply', 'totalSold', 'demand', 'totalRevenue'];

  constructor(public fb: FormBuilder) { }

  ngOnInit(): void {
    this.initializeForms();
    this.setupSearch();
    this.setDataSource(this.selectedTabIndex);
  }

  ngAfterViewInit() {
    this.updatePaginatorAndSort(this.selectedTabIndex);
  }

  initializeForms(): void {
    this.orderPlacedForm = this.fb.group({
      orderPlacedOn: ['']
    });
    this.supplierForm = this.fb.group({
      registeredOn: ['']
    });
    this.dateForm = this.fb.group({
      date: ['']
    });
  }

  setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((query: string) => {
        this.searchQuery = query;
        this.onSearch();
      });
  }

  onTabChange(index: number): void {
    this.selectedTabIndex = index;
    this.setDataSource(index);
    this.updatePaginatorAndSort(this.selectedTabIndex);
    console.log("change tab");

  }

  updatePaginatorAndSort(index: number): void {
    const dataSources = [
      this.userDataSource,
      this.orderDataSource,
      this.supplierDataSource,
      this.agentDataSource,
      this.productDataSource
    ];
    const currentDataSource = dataSources[index];
    if (currentDataSource) {
      currentDataSource.paginator = this.getPaginatorByIndex(index);
      currentDataSource.sort = this.sort;
    }
  }

  getPaginatorByIndex(index: number): MatPaginator {
    switch (index) {
      case 0: return this.usersPaginator;
      case 1: return this.ordersPaginator;
      case 2: return this.supplierPaginator;
      case 3: return this.agentPaginator;
      case 4: return this.productPaginator;
      default: return this.usersPaginator;
    }
  }

  setDataSource(index: number): void {
    const dataSources = [
      { data: ELEMENT_DATA, source: this.userDataSource },
      { data: ELEMENT_DATA2, source: this.orderDataSource },
      { data: ELEMENT_DATA3, source: this.supplierDataSource },
      { data: ELEMENT_DATA4, source: this.agentDataSource },
      { data: ELEMENT_DATA5, source: this.productDataSource }
    ];

    const currentData = dataSources[index];
    if (currentData) {
      currentData.source.data = currentData.data;
    }
  }

  onSearch(): void {
    const dataSource = [
      this.userDataSource,
      this.orderDataSource,
      this.supplierDataSource,
      this.agentDataSource,
      this.productDataSource
    ][this.selectedTabIndex];

    if (dataSource) {
      dataSource.filter = this.searchQuery.trim().toLowerCase();
      if (dataSource.paginator) {
        dataSource.paginator.firstPage();
      }
    }
  }

  toggleContainer(): void {
    this.isContainerVisible = !this.isContainerVisible;
  }
}
export interface UserData {
  id: number;
  name: string;
  phone: string;
  email: string;
  registrationDate: string;
  totalOrders: number;
}

const ELEMENT_DATA: UserData[] = [
  { id: 1, name: 'Alen Skotch', phone: '+91123456789', email: 'alen.skotch1@example.com', registrationDate: '2022-05-11', totalOrders: 15 },
  { id: 2, name: 'Bella Collins', phone: '+91123456780', email: 'bella.collins2@example.com', registrationDate: '2022-06-15', totalOrders: 22 },
  { id: 3, name: 'Chris Johnson', phone: '+91123456781', email: 'chris.johnson3@example.com', registrationDate: '2022-07-20', totalOrders: 8 },
  { id: 4, name: 'Dana White', phone: '+91123456782', email: 'dana.white4@example.com', registrationDate: '2022-08-25', totalOrders: 30 },
  { id: 5, name: 'Eva Green', phone: '+91123456783', email: 'eva.green5@example.com', registrationDate: '2022-09-10', totalOrders: 5 },
  { id: 6, name: 'Frank Miller', phone: '+91123456784', email: 'frank.miller6@example.com', registrationDate: '2022-10-05', totalOrders: 12 },
  { id: 7, name: 'Grace Lee', phone: '+91123456785', email: 'grace.lee7@example.com', registrationDate: '2022-11-15', totalOrders: 18 },
  { id: 8, name: 'Henry Adams', phone: '+91123456786', email: 'henry.adams8@example.com', registrationDate: '2022-12-22', totalOrders: 25 }
  // Add more data as needed
]
  ;


export interface OrderData {
  id: number;
  username: string;
  supplier: string;
  user: string;
  email: string;
  createdOn: string;
  products: string;
  status: string;
}

const ELEMENT_DATA2: OrderData[] = [
  { id: 1, username: 'Alen Skotch', supplier: 'Supplier A', user: 'User A', email: 'alen.skotch1@example.com', createdOn: '2022-05-11', products: 'Product A', status: 'Active' },
  { id: 2, username: 'John Doe', supplier: 'Supplier B', user: 'User B', email: 'john.doe2@example.com', createdOn: '2022-06-12', products: 'Product B', status: 'Inactive' },
  { id: 3, username: 'Jane Smith', supplier: 'Supplier C', user: 'User C', email: 'jane.smith3@example.com', createdOn: '2022-07-13', products: 'Product C', status: 'Active' },
  { id: 4, username: 'Michael Brown', supplier: 'Supplier D', user: 'User D', email: 'michael.brown4@example.com', createdOn: '2022-08-14', products: 'Product D', status: 'Active' },
  { id: 5, username: 'Emily Davis', supplier: 'Supplier E', user: 'User E', email: 'emily.davis5@example.com', createdOn: '2022-09-15', products: 'Product E', status: 'Inactive' },
  { id: 6, username: 'Daniel Lee', supplier: 'Supplier F', user: 'User F', email: 'daniel.lee6@example.com', createdOn: '2022-10-16', products: 'Product F', status: 'Active' },
  { id: 7, username: 'Olivia Wilson', supplier: 'Supplier G', user: 'User G', email: 'olivia.wilson7@example.com', createdOn: '2022-11-17', products: 'Product G', status: 'Active' },
  { id: 8, username: 'James Miller', supplier: 'Supplier H', user: 'User H', email: 'james.miller8@example.com', createdOn: '2022-12-18', products: 'Product H', status: 'Inactive' },
  { id: 9, username: 'Sophia Taylor', supplier: 'Supplier I', user: 'User I', email: 'sophia.taylor9@example.com', createdOn: '2023-01-19', products: 'Product I', status: 'Active' },
  { id: 10, username: 'Liam Anderson', supplier: 'Supplier J', user: 'User J', email: 'liam.anderson10@example.com', createdOn: '2023-02-20', products: 'Product J', status: 'Inactive' },
  { id: 11, username: 'Charlotte Thomas', supplier: 'Supplier K', user: 'User K', email: 'charlotte.thomas11@example.com', createdOn: '2023-03-21', products: 'Product K', status: 'Active' },
  { id: 12, username: 'Ethan Harris', supplier: 'Supplier L', user: 'User L', email: 'ethan.harris12@example.com', createdOn: '2023-04-22', products: 'Product L', status: 'Active' },
  { id: 13, username: 'Amelia Clark', supplier: 'Supplier M', user: 'User M', email: 'amelia.clark13@example.com', createdOn: '2023-05-23', products: 'Product M', status: 'Inactive' },
  { id: 14, username: 'Aiden Lewis', supplier: 'Supplier N', user: 'User N', email: 'aiden.lewis14@example.com', createdOn: '2023-06-24', products: 'Product N', status: 'Active' },
  { id: 15, username: 'Isabella Walker', supplier: 'Supplier O', user: 'User O', email: 'isabella.walker15@example.com', createdOn: '2023-07-25', products: 'Product O', status: 'Inactive' }
];
// displayedSupplierColumns

export interface SupplierData {
  id: number;
  name: string;
  email: string;
  registered: string;
  orders: number;
  delivered: number;
  revenue: number;
  commission: number;
}

const ELEMENT_DATA3: SupplierData[] = [
  { id: 1, name: 'Supplier A', email: 'supplierA@gmail.com', registered: '11-05-22', orders: 15, delivered: 10, revenue: 15000, commission: 1500 },
  { id: 2, name: 'Supplier B', email: 'supplierB@gmail.com', registered: '12-05-22', orders: 20, delivered: 18, revenue: 20000, commission: 2000 },
  // Add more data as needed
];

export interface AgentData {
  id: number;
  name: string;
  email: string;
  supplier: string;
  totalOrders: string;
  delivered: number;
  revenue: number;
}

const ELEMENT_DATA4: AgentData[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    supplier: "Supplier A",
    totalOrders: "20",
    delivered: 18,
    revenue: 5000
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    supplier: "Supplier B",
    totalOrders: "15",
    delivered: 15,
    revenue: 4000
  },
  {
    id: 3,
    name: "Michael Johnson",
    email: "michael@example.com",
    supplier: "Supplier C",
    totalOrders: "10",
    delivered: 9,
    revenue: 3000
  }
  // Add more data as needed
];


export interface ProductData {
  productName: string;
  categoryName: string;
  averageCostPrice: number;
  averageSellingPrice: number;
  sellingPriceRange: string;
  profit: number;
  numberOfSuppliers: number;
  totalCurrentSupply: number;
  totalSold: number;
  demand: string;
  totalRevenue: number;
}

const ELEMENT_DATA5: ProductData[] = [
  {
    productName: "iPhone 14",
    categoryName: "Electronics",
    averageCostPrice: 800.00,
    averageSellingPrice: 999.00,
    sellingPriceRange: "750-1050",
    profit: 199.00,
    numberOfSuppliers: 10,
    totalCurrentSupply: 150,
    totalSold: 120,
    demand: "High",
    totalRevenue: 119880.00
  },
  {
    productName: "Samsung Galaxy S23",
    categoryName: "Electronics",
    averageCostPrice: 750.00,
    averageSellingPrice: 950.00,
    sellingPriceRange: "700-1000",
    profit: 200.00,
    numberOfSuppliers: 8,
    totalCurrentSupply: 100,
    totalSold: 85,
    demand: "Medium",
    totalRevenue: 80750.00
  },
  {
    productName: "Nike Air Max 270",
    categoryName: "Footwear",
    averageCostPrice: 120.00,
    averageSellingPrice: 160.00,
    sellingPriceRange: "110-170",
    profit: 40.00,
    numberOfSuppliers: 15,
    totalCurrentSupply: 200,
    totalSold: 150,
    demand: "High",
    totalRevenue: 24000.00
  },
  {
    productName: "Sony WH-1000XM4",
    categoryName: "Electronics",
    averageCostPrice: 280.00,
    averageSellingPrice: 350.00,
    sellingPriceRange: "270-370",
    profit: 70.00,
    numberOfSuppliers: 12,
    totalCurrentSupply: 80,
    totalSold: 70,
    demand: "High",
    totalRevenue: 24500.00
  },
  {
    productName: "Dell XPS 13",
    categoryName: "Computers",
    averageCostPrice: 1000.00,
    averageSellingPrice: 1300.00,
    sellingPriceRange: "950-1350",
    profit: 300.00,
    numberOfSuppliers: 6,
    totalCurrentSupply: 50,
    totalSold: 45,
    demand: "Medium",
    totalRevenue: 58500.00
  },
  {
    productName: "Canon EOS R5",
    categoryName: "Cameras",
    averageCostPrice: 2500.00,
    averageSellingPrice: 3200.00,
    sellingPriceRange: "2400-3300",
    profit: 700.00,
    numberOfSuppliers: 5,
    totalCurrentSupply: 30,
    totalSold: 25,
    demand: "Medium",
    totalRevenue: 80000.00
  },
  {
    productName: "Kindle Paperwhite",
    categoryName: "Books",
    averageCostPrice: 130.00,
    averageSellingPrice: 160.00,
    sellingPriceRange: "120-170",
    profit: 30.00,
    numberOfSuppliers: 7,
    totalCurrentSupply: 120,
    totalSold: 100,
    demand: "High",
    totalRevenue: 16000.00
  },
  {
    productName: "Sony PlayStation 5",
    categoryName: "Gaming",
    averageCostPrice: 450.00,
    averageSellingPrice: 500.00,
    sellingPriceRange: "400-550",
    profit: 50.00,
    numberOfSuppliers: 10,
    totalCurrentSupply: 70,
    totalSold: 60,
    demand: "High",
    totalRevenue: 30000.00
  },
  {
    productName: "Apple Watch Series 8",
    categoryName: "Wearables",
    averageCostPrice: 300.00,
    averageSellingPrice: 400.00,
    sellingPriceRange: "280-420",
    profit: 100.00,
    numberOfSuppliers: 9,
    totalCurrentSupply: 90,
    totalSold: 75,
    demand: "High",
    totalRevenue: 30000.00
  },
  {
    productName: "GoPro Hero 11",
    categoryName: "Cameras",
    averageCostPrice: 350.00,
    averageSellingPrice: 450.00,
    sellingPriceRange: "330-470",
    profit: 100.00,
    numberOfSuppliers: 4,
    totalCurrentSupply: 40,
    totalSold: 35,
    demand: "Medium",
    totalRevenue: 15750.00
  },
  {
    productName: "Instant Pot Duo 7-in-1",
    categoryName: "Kitchenware",
    averageCostPrice: 90.00,
    averageSellingPrice: 120.00,
    sellingPriceRange: "80-130",
    profit: 30.00,
    numberOfSuppliers: 11,
    totalCurrentSupply: 150,
    totalSold: 120,
    demand: "High",
    totalRevenue: 14400.00
  }
];
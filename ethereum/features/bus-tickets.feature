Feature: Bus tickets

    Bus tickets
    Scenario: Buying a ticket
      Given Bus '0000 XXX' of 'Verstappen'
      And Verstappen' schedules the transfer 'Airport' to 'Palma' at '2022-01-14 10:00' at 0.5 ETH 
      When 'Sainz' buys 1 ticket and pays 0.5 ETH
      Then 'Sainz' owns 1 seat for the transfer 'Palma-Airport'

    Scenario: Tickets must be paid
      Given Bus '0000 XXX' of 'Verstappen'
      And Verstappen' schedules the transfer 'Airport' to 'Palma' at '2022-01-14 10:00' at 0.5 ETH 
      When 'Hamilton' buys 2 tickets and pays 0.5 ETH
      Then operation is rejected
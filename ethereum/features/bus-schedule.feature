Feature: Bus timetable

    Bus timetable
    Scenario: Scheduling transfers for a Bus
      Given Bus '0000 XXX' of 'Verstappen'
      When 'Verstappen' schedules the transfer 'Airport' to 'Palma' at '2022-01-14 10:00' at 0.5 ETH
      Then transfer 'Airport' to 'Palma' at '2022-01-14 10:00' for 0.5 ETH is scheduled for the Bus '0000 XXX'

    Scenario: Only the owner of the Bus can schedule transfers
      Given Bus '0000 XXX' of 'Verstappen'
      When 'Hamilton' schedules the transfer 'London' to 'Heathrow' at '2022-01-14 10:00' at 0.5 ETH
      Then operation is rejected with error 'Only the owner can execute this function'